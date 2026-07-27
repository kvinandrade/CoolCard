# CoolCard

Aplicativo web gratuito para gerar carteirinhas estudantis no formato vertical.

## Funcionalidades

- Upload de foto
- CPF como número de matrícula (RA)
- Seleção de curso
- Datas de início e término com validade automática
- Frente e verso da carteirinha (com QR Code de validação)
- Download em imagem (PNG) ou PDF

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Publicação

O app está configurado para deploy na Vercel (SPA com rewrite para `index.html`).
