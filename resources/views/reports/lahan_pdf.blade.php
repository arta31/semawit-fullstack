<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Hasil Panen - {{ $lahan->nama_lahan }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: #2b2b2b;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 18px;
            margin: 0;
            color: #064e3b;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .header p {
            margin: 3px 0;
            font-size: 10px;
            color: #4b5563;
        }
        .divider {
            border: 0;
            border-top: 2px solid #064e3b;
            border-bottom: 1px solid #064e3b;
            height: 3px;
            margin-top: 5px;
            margin-bottom: 15px;
        }
        .title-doc {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
            color: #111827;
        }
        .meta-table {
            width: 100%;
            margin-bottom: 15px;
            border-collapse: collapse;
        }
        .meta-table td {
            padding: 3px 0;
            vertical-align: top;
        }
        .meta-label {
            font-weight: bold;
            width: 150px;
        }
        .meta-value {
            width: auto;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .data-table th {
            background-color: #064e3b;
            color: #ffffff;
            font-weight: bold;
            text-align: center;
            padding: 8px 5px;
            border: 1px solid #064e3b;
            font-size: 10px;
        }
        .data-table td {
            padding: 6px 5px;
            border: 1px solid #d1d5db;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .row-total {
            background-color: #f3f4f6;
            font-weight: bold;
        }
        .footer-sign {
            margin-top: 40px;
            width: 100%;
            border-collapse: collapse;
        }
        .footer-sign td {
            width: 50%;
            text-align: center;
            vertical-align: top;
        }
        .signature-box {
            margin-top: 50px;
            font-weight: bold;
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <!-- KOP SURAT RESMI KUD SEMAWIT -->
    <div class="header">
        <h1>Koperasi Unit Desa (KUD) Semawit</h1>
        <p>Sistem Kemitraan Mandiri & Manajemen Sinking Fund Petani Kelapa Sawit</p>
        <p>Jl. Poros Sawit No. 12, Distrik Makmur, Riau | Kontak: 0812-3456-7890 | Email: kud@semawit.or.id</p>
        <div class="divider"></div>
    </div>

    <!-- JUDUL DOKUMEN -->
    <div class="title-doc">Laporan Ringkasan Hasil Panen & Sinking Fund</div>

    <!-- DETAIL INFORMASI PETANI & LAHAN -->
    <table class="meta-table">
        <tr>
            <td class="meta-label">Nama Petani</td>
            <td>:</td>
            <td class="meta-value">{{ $lahan->user->name }}</td>
            <td class="meta-label">ID Lahan / Lokasi</td>
            <td>:</td>
            <td class="meta-value">{{ $lahan->nama_lahan }} {{ $lahan->lokasi_koordinat ? '('.$lahan->lokasi_koordinat.')' : '' }}</td>
        </tr>
        <tr>
            <td class="meta-label">Nomor WhatsApp</td>
            <td>:</td>
            <td class="meta-value">{{ $lahan->user->phone_number }}</td>
            <td class="meta-label">Luas Lahan / Estimasi Pohon</td>
            <td>:</td>
            <td class="meta-value">{{ number_format($lahan->luas_lahan_hektar, 2, ',', '.') }} Ha / {{ $lahan->jumlah_pohon }} Pohon</td>
        </tr>
        <tr>
            <td class="meta-label">Tanggal Cetak</td>
            <td>:</td>
            <td class="meta-value">{{ $tanggalCetak }}</td>
            <td class="meta-label">Alokasi Simpanan Pupuk / Racun</td>
            <td>:</td>
            <td class="meta-value">{{ number_format($lahan->informasiPerawatan->persen_pupuk, 1) }}% / {{ number_format($lahan->informasiPerawatan->persen_racun, 1) }}%</td>
        </tr>
    </table>

    <!-- TABEL UTAMA REKAPITULASI PANEN -->
    <table class="data-table">
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="12%">Tanggal Panen</th>
                <th width="12%">Berat TBS (Kg)</th>
                <th width="13%">Harga Jual (Rp)</th>
                <th width="15%">Total Pendapatan (Rp)</th>
                <th width="14%">Tabungan Pupuk (Rp)</th>
                <th width="14%">Tabungan Racun (Rp)</th>
                <th width="15%">Pendapatan Bersih (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($riwayatPanen as $index => $panen)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ $panen->tanggal_panen->format('d-m-Y') }}</td>
                    <td class="text-center">{{ number_format($panen->berat_bersih_kg, 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($panen->harga_per_kg, 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($panen->total_pendapatan, 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($panen->nominal_pupuk, 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($panen->nominal_racun, 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($panen->nominal_rumah_tangga, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center" style="padding: 15px; color: #6b7280;">Belum ada catatan transaksi panen pada lahan ini.</td>
                </tr>
            @endforelse

            <!-- BARIS TOTAL AKUMULASI -->
            @if($riwayatPanen->isNotEmpty())
                <tr class="row-total">
                    <td colspan="2" class="text-center">TOTAL AKUMULASI</td>
                    <td class="text-center">{{ number_format($ringkasan['total_berat'], 0, ',', '.') }}</td>
                    <td class="text-right">-</td>
                    <td class="text-right">{{ number_format($ringkasan['total_pendapatan'], 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($ringkasan['total_tabungan_pupuk'], 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($ringkasan['total_tabungan_racun'], 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($ringkasan['total_rumah_tangga'], 0, ',', '.') }}</td>
                </tr>
            @endif
        </tbody>
    </table>

    <!-- KETERANGAN SALDO BERJALAN SAAT INI -->
    @if($riwayatPanen->isNotEmpty())
        <div style="margin-top: 15px; background-color: #f9fafb; padding: 10px; border: 1px solid #e5e7eb; border-radius: 4px;">
            <strong>Catatan Saldo Tabungan Berjalan (Sinking Fund):</strong>
            <ul style="margin: 5px 0 0 15px; padding: 0;">
                <li>Saldo Akumulasi Tabungan Pupuk: <strong>Rp {{ number_format($lahan->informasiPerawatan->saldo_pupuk_saat_ini, 0, ',', '.') }}</strong> (