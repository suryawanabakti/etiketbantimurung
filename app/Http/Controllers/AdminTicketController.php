<?php

namespace App\Http\Controllers;

use App\Models\Tiket;
use App\Models\Pemesanan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Tiket::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where('nama_tiket', 'like', '%' . $request->search . '%');
        }

        // Filter by status (active/expired)
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('tanggal_berlaku', '>=', now()->toDateString());
            } elseif ($request->status === 'expired') {
                $query->where('tanggal_berlaku', '<', now()->toDateString());
            }
        }

        $tickets = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('admin/tickets/index', [
            'tickets' => $tickets,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/tickets/form', [
            'ticket' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_tiket' => 'required|string|max:255',
            'harga' => 'required|numeric|min:0',
            'kuota' => 'required|integer|min:0',
            'tanggal_berlaku' => 'required|date',
        ]);

        Tiket::create($validated);

        return redirect()->route('admin.tickets.index')
            ->with('success', 'Tiket berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $ticket = Tiket::findOrFail($id);

        return Inertia::render('admin/tickets/form', [
            'ticket' => $ticket,
        ]);
    }

    public function update(Request $request, $id)
    {
        $ticket = Tiket::findOrFail($id);

        $validated = $request->validate([
            'nama_tiket' => 'required|string|max:255',
            'harga' => 'required|numeric|min:0',
            'kuota' => 'required|integer|min:0',
            'tanggal_berlaku' => 'required|date',
        ]);

        $ticket->update($validated);

        return redirect()->route('admin.tickets.index')
            ->with('success', 'Tiket berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $ticket = Tiket::findOrFail($id);

        // Check if ticket has been used in any bookings
        $hasBookings = Pemesanan::where('tiket_id', $id)->exists();

        if ($hasBookings) {
            return back()->with('error', 'Tiket tidak dapat dihapus karena sudah digunakan dalam pemesanan.');
        }

        $ticket->delete();

        return back()->with('success', 'Tiket berhasil dihapus!');
    }
}
