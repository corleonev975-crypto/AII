# Xinn AI Groq Starter

UI chat bergaya GPT dengan:
- Groq API
- upload gambar / foto
- voice input dari browser
- avatar GIF bulat di hero
- riwayat chat di localStorage
- siap deploy ke Vercel

## 1. Install

```bash
npm install
```

## 2. Isi API key

Copy `.env.example` menjadi `.env.local`, lalu isi:

```bash
GROQ_API_KEY=isi_api_groq_kamu
```

## 3. Jalankan

```bash
npm run dev
```

## 4. Deploy ke Vercel

- Upload repo ke GitHub
- Import ke Vercel
- Tambahkan environment variable `GROQ_API_KEY`
- Deploy

## Catatan

- Untuk voice input, browser yang paling aman biasanya Chrome Android / Chrome Desktop.
- Untuk gambar, app akan otomatis memakai model vision.
- Ganti avatar di `public/avatar.gif` jika mau pakai avatar sendiri.
