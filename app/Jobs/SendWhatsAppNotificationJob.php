<?php

namespace App\Jobs;

use App\Models\DataPanen;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendWhatsAppNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $dataPanen;

    /**
     * Tentukan batas percobaan ulang jika terjadi kegagalan koneksi
     */
    public $tries = 3;
    public $backoff = 60; // Tunggu 60 detik sebelum mencoba lagi

    public function __construct(DataPanen $dataPanen)
    {
        $this->dataPanen = $dataPanen;
    }

    public function handle(): void
    {
        // Hubungkan relasi yang dibutuhkan
        $panen = $this->dataPanen->load(['profilLahan.user', 'profilLahan.informasiPerawatan']);
        $petani = $panen->profilLahan->user;
        $perawatan = $panen->profilLahan->informasiPerawatan;

        $namaPetani = $petani->name;
        $nomorWa = $petani->phone_number;
        
        // Buat format rupiah manual tanpa dependensi eksternal
        $totalPendapatan = number_format($panen->total_pendapatan, 0, ',', '.');
        $nominalPupuk = number_format($panen->nominal_pupuk, 0, ',', '.');
        $nominalRacun = number_format($panen->nominal_racun, 0, ',', '.');
        $nominalRumahTangga = number_format($panen->nominal_rumah_tangga, 0, ',', '.');
        
        $saldoPupuk = number_format($perawatan->saldo_pupuk_saat_ini, 0, ',', '.');
        $saldoRacun = number_format($perawatan->saldo_racun_saat_ini, 0, ',', '.');
        
        $tanggal = $panen->tanggal_panen->format('d-m-Y');

        // Konstruksi Pesan Teks
        $pesan = "Halo Pak/Bu {$namaPetani}, panen tanggal {$tanggal} telah dicatat.\n\n"
               . "Total Hasil: " . number_format($panen->berat_bersih_kg, 0, ',', '.') . " kg (Rp {$totalPendapatan}).\n\n"
               . "Alokasi Sinking Fund:\n"
               . "- Tabungan Pupuk (+ Rp {$nominalPupuk})\n"
               . "- Tabungan Racun (+ Rp {$nominalRacun})\n"
               . "Sisa Pendapatan Rumah Tangga yang dapat diambil: Rp {$nominalRumahTangga}.\n\n"
               . "Saldo Tabungan Anda Saat Ini:\n"
               . "- Pupuk: Rp {$saldoPupuk}\n"
               . "- Racun: Rp {$saldoRacun}";

        // Integrasi dengan Webhook API Gateway Pihak Ketiga (Simulasi Fonnte / sejenisnya)
        $endpoint = config('services.whatsapp.api_endpoint', 'https://api.fonnte.com/send');
        $token = config('services.whatsapp.api_token');

        try {
            $response = Http::withHeaders([
                'Authorization' => $token,
            ])->post($endpoint, [
                'target' => $nomorWa,
                'message' => $pesan,
                'countryCode' => '62', // Default Indonesia
            ]);

            if ($response->failed()) {
                Log::warning("Gagal mengirim notifikasi WA ke {$nomorWa}. Status: " . $response->status() . " Response: " . $response->body());
                throw new \Exception("Kegagalan respons API Gateway.");
            }

            Log::info("Notifikasi WhatsApp berhasil dikirim ke nomor: {$nomorWa} untuk transaksi panen ID: {$panen->id}");

        } catch (\Exception $e) {
            Log::error("Error saat mengirimkan pesan WhatsApp: " . $e->getMessage());
            // Lepaskan kembali job ke antrean untuk dicoba ulang nanti sesuai konfigurasi $tries
            $this->release($this->backoff);
        }
    }
}