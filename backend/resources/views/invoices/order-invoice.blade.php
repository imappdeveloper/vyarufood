<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $order->order_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #333; line-height: 1.5; }
        .invoice-box { max-width: 700px; margin: 0 auto; padding: 30px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 3px solid #059669; }
        .brand h1 { font-size: 22px; color: #059669; font-weight: 800; margin-bottom: 2px; }
        .brand p { font-size: 11px; color: #666; }
        .invoice-title { text-align: right; }
        .invoice-title h2 { font-size: 18px; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; }
        .invoice-title p { font-size: 11px; color: #666; margin-top: 4px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 25px; }
        .meta-box { width: 48%; }
        .meta-box h3 { font-size: 11px; text-transform: uppercase; color: #059669; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px; }
        .meta-box p { font-size: 12px; color: #333; margin-bottom: 3px; }
        .meta-box .label { color: #888; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        thead th { background: #059669; color: white; padding: 10px 12px; font-size: 11px; text-transform: uppercase; text-align: left; font-weight: 600; }
        thead th:last-child { text-align: right; }
        tbody td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 12px; }
        tbody td:last-child { text-align: right; font-weight: 600; }
        tbody tr:nth-child(even) { background: #f8fafc; }
        .totals { display: flex; justify-content: flex-end; margin-bottom: 25px; }
        .totals-box { width: 280px; }
        .totals-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; }
        .totals-row.discount { color: #059669; }
        .totals-row.total { border-top: 2px solid #059669; padding-top: 8px; margin-top: 5px; font-weight: 800; font-size: 14px; color: #059669; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; }
        .footer p { font-size: 11px; color: #888; margin-bottom: 3px; }
        .footer .thanks { font-size: 14px; color: #059669; font-weight: 700; margin-bottom: 8px; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
        .badge-paid { background: #d1fae5; color: #059669; }
        .badge-pending { background: #fef3c7; color: #d97706; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <div class="brand">
                <h1>VyaruFood Tiffin</h1>
                <p>Fresh, Healthy Meals Delivered</p>
                <p style="margin-top: 6px;">📍 VyaruFood, India</p>
                <p>📞 support@vyarufood.com</p>
            </div>
            <div class="invoice-title">
                <h2>Invoice</h2>
                <p><strong>{{ $order->order_number_display ?? $order->order_number }}</strong></p>
                <p>Date: {{ $order->created_at->format('d M, Y') }}</p>
                <p style="margin-top: 8px;">
                    @if ($order->payment_status === 'paid')
                        <span class="badge badge-paid">PAID</span>
                    @else
                        <span class="badge badge-pending">PENDING</span>
                    @endif
                </p>
            </div>
        </div>

        <div class="meta">
            <div class="meta-box">
                <h3>Bill To</h3>
                <p style="font-weight: 600;">{{ $customer->first_name }} {{ $customer->last_name }}</p>
                <p>{{ $customer->email }}</p>
                <p>{{ $customer->phone }}</p>
            </div>
            <div class="meta-box">
                <h3>Delivery Address</h3>
                @if ($order->address)
                    <p>{{ $order->address->address_line_1 }}</p>
                    @if ($order->address->address_line_2)
                        <p>{{ $order->address->address_line_2 }}</p>
                    @endif
                    <p>{{ $order->address->city?->name }}, {{ $order->address->state?->name }} - {{ $order->address->pincode?->pincode }}</p>
                @endif
                @if ($order->delivery_date)
                    <p style="margin-top: 6px;"><span class="label">Delivery Date:</span> {{ $order->delivery_date->format('d M, Y') }}</p>
                @endif
                @if ($order->delivery_slot)
                    <p><span class="label">Time Slot:</span> {{ ucfirst($order->delivery_slot) }}</p>
                @endif
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Tax</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($order->orderItems as $index => $item)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>
                            <strong>{{ $item->meal_name }}</strong>
                            @if ($item->remarks)
                                <br><span style="font-size: 10px; color: #888;">{{ $item->remarks }}</span>
                            @endif
                        </td>
                        <td>{{ $item->quantity }}</td>
                        <td>₹{{ number_format($item->unit_price, 2) }}</td>
                        <td>₹{{ number_format($item->tax, 2) }}</td>
                        <td>₹{{ number_format($item->total, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-box">
                <div class="totals-row">
                    <span>Subtotal</span>
                    <span>₹{{ number_format($order->subtotal, 2) }}</span>
                </div>
                @if ($order->discount_amount > 0)
                    <div class="totals-row discount">
                        <span>Meal Discount</span>
                        <span>-₹{{ number_format($order->discount_amount, 2) }}</span>
                    </div>
                @endif
                @if ($order->coupon_amount > 0)
                    <div class="totals-row discount">
                        <span>Coupon Discount</span>
                        <span>-₹{{ number_format($order->coupon_amount, 2) }}</span>
                    </div>
                @endif
                @if ($order->wallet_amount > 0)
                    <div class="totals-row discount">
                        <span>Wallet Used</span>
                        <span>-₹{{ number_format($order->wallet_amount, 2) }}</span>
                    </div>
                @endif
                <div class="totals-row">
                    <span>Tax (GST)</span>
                    <span>₹{{ number_format($order->tax_amount, 2) }}</span>
                </div>
                <div class="totals-row">
                    <span>Delivery</span>
                    <span>{{ $order->delivery_charge > 0 ? '₹' . number_format($order->delivery_charge, 2) : 'FREE' }}</span>
                </div>
                <div class="totals-row total">
                    <span>Total</span>
                    <span>₹{{ number_format($order->total_amount, 2) }}</span>
                </div>
            </div>
        </div>

        <div class="footer">
            <p class="thanks">Thank you for ordering with VyaruFood!</p>
            <p>For any queries, contact us at support@vyarufood.com</p>
            <p>This is a computer-generated invoice.</p>
        </div>
    </div>
</body>
</html>
