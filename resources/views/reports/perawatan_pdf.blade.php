<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Transaksi Perawatan - {{ $lahan->nama_lahan }}</title>
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
        .badge-pupuk {
            color: #065f46;
            font-weight: bold;
        }
        .badge-racun {
            color: #1d4ed8;
            font-weight: bold;
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
    <div class="title-doc">Laporan Riwayat Transaksi Perawatan Lahan</div>

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
            <td class="meta-label">Tanggal Cetak</td>
            <td>:</td>
            <td class="meta-value">{{ $tanggalCetak }}</td>
        </tr>
    </table>

    <!-- TABEL RIWAYAT TRANSAKSI PERAWATAN -->
    <table class="data-table">
        <thead>
            <tr>
                <th width="6%">No</th>
                <th width="15%">Tanggal Transaksi</th>
                <th width="15%">Jenis Tabungan</th>
                <th width="20%">Nominal Dipotong (Rp)</th>
                <th width="44%">Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @forelse($riwayatPerawatan as $index => $log)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ \Carbon\Carbon::parse($log->tanggal_transaksi)->format('d-m-Y') }}</td>
                    <td class="text-center {{ $log->jenis_perawatan === 'pupuk' ? 'badge-pupuk' : 'badge-racun' }}">
                        {{ ucfirst($log->jenis_perawatan) }}
                    </td>
                    <td class="text-right">{{ number_format($log->jumlah_pengeluaran, 0, ',', '.') }}</td>
                    <td>{{ $log->deskripsi }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center" style="padding: 15px; color: #6b7280;">Belum ada catatan transaksi perawatan pada lahan ini.</td>
                </tr>
            @endforelse

            <!-- BARIS TOTAL AKUMULASI -->
            @if($riwayatPerawatan->isNotEmpty())
                <tr class="row-total">
                    <td colspan="3" class="text-center">TOTAL PENCAIRAN PUPUK / RACUN</td>
                    <td class="text-right">
                        {{ number_format($ringkasan['total_pupuk'], 0, ',', '.') }} / {{ number_format($ringkasan['total_racun'], 0, ',', '.') }}
                    </td>
                    <td class="text-right">Total: Rp {{ number_format($ringkasan['total_keseluruhan'], 0, ',', '.') }}</td>
                </tr>
            @endif
        </tbody>
    </table>

    <!-- TANDA TANGAN -->
    <table class="footer-sign">
        <tr>
            <td>
                <p>Mengetahui,</p>
                <p>Petani Anggota</p>
                <div class="signature-box">{{ $lahan->user->name }}</div>
            </td>
            <td>
                <p>Disahkan oleh,</p>
                <p>Admin KUD SEMAWIT</p>
                <div class="signature-box">.....................................</div>
            </td>
        </tr>
    </table>

</body>
</html>
