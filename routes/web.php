<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'tikets' => \App\Models\Tiket::all(),
    ]);
})->name('home');

Route::post('payment/notification', [PaymentController::class, 'notification'])->name('payment.notification');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('tickets/scan', [TicketController::class, 'index'])->name('tickets.scan.view');
    Route::post('tickets/scan', [TicketController::class, 'scan'])->name('tickets.scan');

    // Booking
    Route::get('booking', [BookingController::class, 'index'])->name('booking.index');
    Route::post('booking', [BookingController::class, 'store'])->name('booking.store');
    Route::get('booking/{id}/success', [BookingController::class, 'success'])->name('booking.success');
    Route::post('booking/{id}/pay', [BookingController::class, 'repay'])->name('booking.pay');

    // Invoice
    Route::get('invoice/{id}', [InvoiceController::class, 'show'])->name('invoice.show');

    // Transactions & Reports
    Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('transactions/{id}/approve', [TransactionController::class, 'approve'])->name('transactions.approve');
    Route::get('reports', [TransactionController::class, 'report'])->name('reports.index');

    // Admin Ticket Management
    Route::prefix('admin/tickets')->name('admin.tickets.')->group(function () {
        Route::get('/', [\App\Http\Controllers\AdminTicketController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\AdminTicketController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\AdminTicketController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [\App\Http\Controllers\AdminTicketController::class, 'edit'])->name('edit');
        Route::put('/{id}', [\App\Http\Controllers\AdminTicketController::class, 'update'])->name('update');
        Route::delete('/{id}', [\App\Http\Controllers\AdminTicketController::class, 'destroy'])->name('destroy');
    });
});


require __DIR__ . '/settings.php';

if (app()->environment('local')) {
    Route::get('test-wa', function (\App\Services\WhatsAppService $wa) {
        $to = request('to', '6285183028432');
        $message = request('message', 'Halo! Ini adalah pesan pengetesan dari sistem e-tiket Bantimurung.');

        $result = $wa->sendWhatsApp($to, $message);

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => "Pesan berhasil dikirim ke $to"
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal mengirim pesan via Mocean API. Periksa Log untuk detail.'
        ], 500);
    });
}
