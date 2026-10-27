<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Tanda Terima {{ $service->code }}</title>
    <style>
        @page { margin: 34px 38px; }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            color: #1f2937;
            font-family: "DejaVu Sans", sans-serif;
            font-size: 11px;
            line-height: 1.55;
        }

        .muted { color: #6b7280; }
        .small { font-size: 9px; }
        .strong { font-weight: bold; }
        .right { text-align: right; }
        .center { text-align: center; }

        .header {
            width: 100%;
            border-bottom: 3px solid #f2470c;
            padding-bottom: 14px;
        }

        .brand {
            color: #f2470c;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: -0.2px;
        }

        .brand-sub {
            margin-top: 3px;
            color: #6b7280;
            font-size: 9px;
        }

        .doc-title {
            margin: 24px 0 2px;
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }

        .ticket-code {
            color: #f2470c;
            font-size: 23px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .meta-table {
            width: 100%;
            margin-top: 18px;
            border-collapse: collapse;
        }

        .meta-table td {
            padding: 5px 0;
            vertical-align: top;
        }

        .meta-table .label {
            width: 130px;
            color: #6b7280;
            font-size: 9px;
            letter-spacing: 0.6px;
            text-transform: uppercase;
        }

        .panel {
            width: 100%;
            margin-top: 18px;
            border: 1px solid #e5e7eb;
            border-collapse: collapse;
        }

        .panel th {
            padding: 8px 12px;
            border-bottom: 1px solid #e5e7eb;
            background: #f8f6f2;
            color: #374151;
            font-size: 9px;
            letter-spacing: 0.7px;
            text-align: left;
            text-transform: uppercase;
        }

        .panel td {
            padding: 11px 12px;
            border-bottom: 1px solid #f0efec;
            vertical-align: top;
        }

        .panel tr:last-child td { border-bottom: 0; }

        .two-col { width: 100%; border-collapse: collapse; }
        .two-col > tbody > tr > td { width: 50%; vertical-align: top; }
        .two-col > tbody > tr > td:first-child { padding-right: 8px; }
        .two-col > tbody > tr > td:last-child { padding-left: 8px; }

        .field-label {
            color: #6b7280;
            font-size: 9px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .field-value {
            margin-top: 2px;
            font-size: 11px;
            font-weight: bold;
        }

        .issue {
            margin-top: 8px;
            padding: 10px 12px;
            border-left: 3px solid #f2470c;
            background: #fdf7f4;
            white-space: pre-line;
        }

        .status {
            display: inline-block;
            padding: 3px 9px;
            border: 1px solid #f2470c;
            border-radius: 10px;
            color: #b93815;
            font-size: 9px;
            font-weight: bold;
        }

        .note {
            margin-top: 16px;
            padding: 10px 12px;
            border: 1px solid #e5e7eb;
            background: #fafaf9;
            color: #4b5563;
            font-size: 9px;
            line-height: 1.6;
        }

        .signatures {
            width: 100%;
            margin-top: 36px;
            border-collapse: collapse;
        }

        .signatures td {
            width: 50%;
            padding-top: 40px;
            vertical-align: bottom;
            text-align: center;
        }

        .signature-line {
            width: 180px;
            margin: 0 auto;
            border-top: 1px solid #9ca3af;
            padding-top: 5px;
            color: #4b5563;
            font-size: 9px;
        }

        .footer {
            margin-top: 26px;
            border-top: 1px solid #e5e7eb;
            padding-top: 8px;
            color: #9ca3af;
            font-size: 8px;
            text-align: center;
        }
    </style>
</head>
<body>
    <table class="header">
        <tr>
            <td>
                <div class="brand">{{ $company['name'] }}</div>
                <div class="brand-sub">Alat kesehatan, servis, dan pendampingan teknis</div>
            </td>
            <td class="right small muted">
                @if ($company['address'])
                    {{ $company['address'] }}<br>
                @endif
                @if ($company['city'])
                    {{ $company['city'] }}<br>
                @endif
                @if ($company['phone'])
                    WhatsApp {{ $company['phone'] }}<br>
                @endif
                @if ($company['email'])
                    {{ $company['email'] }}
                @endif
            </td>
        </tr>
    </table>

    <div class="doc-title">Tanda Terima Servis</div>
    <div class="ticket-code">{{ $service->code }}</div>
    <div class="muted small">
        Dibuat {{ $service->created_at?->format('d/m/Y H:i') }} WITA
        @if ($company['hours'])
            | {{ $company['hours'] }}
        @endif
    </div>

    <table class="meta-table">
        <tr>
            <td class="label">Pemohon</td>
            <td>
                <span class="strong">{{ $service->customer->name }}</span>
                @if ($service->customer->institution)
                    - {{ $service->customer->institution }}
                @endif
                @if ($service->customer->city)
                    <span class="muted"> | {{ $service->customer->city }}</span>
                @endif
            </td>
        </tr>
        <tr>
            <td class="label">Nomor WhatsApp</td>
            <td>{{ $service->customer->phone }}</td>
        </tr>
        @if ($service->customer->email)
            <tr>
                <td class="label">Email</td>
                <td>{{ $service->customer->email }}</td>
            </tr>
        @endif
        <tr>
            <td class="label">Status tiket</td>
            <td><span class="status">{{ $service->status->value }}</span></td>
        </tr>
    </table>

    <table class="panel">
        <tr>
            <th colspan="2">Detail alat</th>
        </tr>
        <tr>
            <td>
                <div class="field-label">Nama alat</div>
                <div class="field-value">{{ $service->equipment_name }}</div>
            </td>
            <td>
                <div class="field-label">Brand / model</div>
                <div class="field-value">
                    {{ trim(implode(' ', array_filter([$service->brand, $service->model]))) ?: '-' }}
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="field-label">Nomor seri</div>
                <div class="field-value">{{ $service->serial_number ?: '-' }}</div>
            </td>
            <td>
                <div class="field-label">Preferensi penanganan</div>
                <div class="field-value">{{ $service->preference->label() }}</div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="field-label">Lokasi alat</div>
                <div class="field-value">{{ $service->location ?: '-' }}</div>
            </td>
            <td>
                <div class="field-label">Teknisi</div>
                <div class="field-value">{{ $service->technician?->name ?: 'Belum ditugaskan' }}</div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="field-label">Jadwal</div>
                <div class="field-value">
                    {{ $service->scheduled_at?->format('d/m/Y H:i') ? $service->scheduled_at->format('d/m/Y H:i').' WITA' : 'Belum dijadwalkan' }}
                </div>
            </td>
            <td>
                <div class="field-label">Estimasi biaya</div>
                <div class="field-value">
                    @if ($service->estimated_cost !== null)
                        Rp {{ number_format($service->estimated_cost, 0, ',', '.') }}
                    @else
                        Menunggu diagnosa
                    @endif
                </div>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <div class="field-label">Keluhan</div>
                <div class="issue">{{ $service->issue }}</div>
            </td>
        </tr>
    </table>

    <div class="note">
        Dokumen ini adalah tanda terima pengajuan servis, bukan bukti pembayaran.
        Estimasi biaya dapat berubah setelah pemeriksaan langsung oleh teknisi.
        Simpan kode tiket <span class="strong">{{ $service->code }}</span> dan
        gunakan 4 digit terakhir nomor WhatsApp untuk memantau status melalui
        halaman Cek Status Servis.
    </div>

    <table class="signatures">
        <tr>
            <td>
                <div class="signature-line">Pemohon / pelanggan</div>
            </td>
            <td>
                <div class="signature-line">PT. Mandalika Global Alkesindo</div>
            </td>
        </tr>
    </table>

    <div class="footer">
        Dicetak {{ now()->format('d/m/Y H:i') }} | {{ $service->code }} |
        {{ $company['name'] }}
    </div>
</body>
</html>
