# PENDING TODO

## 1. Ubah worker data jadi immutable dari yang existing object literal
**Status:** Pending  
**Deskripsi:**
- Ubah worker data dari object literal menjadi immutable
- Gunakan immutable class pattern untuk existing object literal
- Pastikan semua worker data tidak bisa dimutasi setelah dibuat

**Tasks:**
- [ ] Identifikasi semua worker data yang menggunakan object literal
- [ ] Ubah implementasi menjadi immutable class
- [ ] Update semua tempat yang mengakses worker data
- [ ] Testing perubahan

---

## 2. Tambahan isConnected di postgre yang auto update state di infra postgre/redis isConnected tanpa ada trigger dari luar
**Status:** Pending  
**Deskripsi:**
- Tambahkan isConnected di PostgreSQL
- Auto update state connection status menggunakan event listener
- Sinkronisasi state isConnected antara PostgreSQL dan Redis
- Tidak ada trigger manual dari luar sistem

**Tasks:**
- [ ] Implementasi monitoring koneksi PostgreSQL
- [ ] Implementasi auto update state isConnected
- [ ] Sinkronisasi state ke Redis
- [ ] Buat mekanisme update otomatis tanpa external trigger