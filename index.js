const {
default: makeWASocket,
useMultiFileAuthState
}=require("@whiskeysockets/baileys")

const pino=require("pino")
const qrcode=require("qrcode-terminal")

const catalog=require("./catalog")


const OWNER=[
"6285828169882"
]


async function startBot(){

const {state,saveCreds}=await useMultiFileAuthState(
"./session"
)


const sock=makeWASocket({

auth:state,

logger:pino({
level:"silent"
})

})


sock.ev.on(
"creds.update",
saveCreds
)


sock.ev.on(
"connection.update",
(update)=>{

const {connection,qr}=update


if(qr){

qrcode.generate(qr,{
small:true
})

}


if(connection==="open"){

console.log(
"🎀 NZstore Bot Online"
)

}

})


sock.ev.on(
"messages.upsert",
async({messages})=>{


const msg=messages[0]

if(!msg.message)
return


// hanya grup

if(!msg.key.remoteJid.endsWith("@g.us"))
return


const text =
(
msg.message.conversation ||
msg.message.extendedTextMessage?.text ||
""
).toLowerCase()



// MENU

if(text=="menu"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:
`
🎀 Welcome to NZstore 🛒✨

Terima kasih sudah bergabung.

Gunakan bot untuk:

🛒 Cek Produk
💰 Cek Harga
📦 Bantuan Order
💳 Payment


🎀 NZstore MENU

🛒 Produk
💰 Harga
📌 Rules Order
📦 Cara Order
💳 Payment
👤 Admin

Ketik nama menu.
`
})

}



// KATALOG

if(text=="capcut"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:catalog.capcut
})

}


if(text=="canva"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:catalog.canva
})

}


if(text=="netflix"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:catalog.netflix
})

}


if(text=="spotify"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:catalog.spotify
})

}


if(text=="kebsos"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:catalog.kebsos
})

}



if(text=="premium"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:catalog.premium_lainnya
})

}



// PAYMENT

if(text=="payment"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:
`
💳 PAYMENT NZstore

GoPay

Nomor:
085828626140

A/N:
Zhraa


Setelah pembayaran:

Kirim bukti pembayaran ke admin.

Pembayaran tanpa bukti tidak dapat diproses.
`
})

}



// ORDER

if(text=="order"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:
`
📦 FORMAT ORDER NZstore

Produk:
Paket:
Nama:

Untuk KEBsos:

Produk:
Paket:
Jumlah:
Username/Link:
Nama:


Pastikan data order benar.
`
})

}



// RULES

if(text=="rules"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:
`
📌 RULES ORDER NZSTORE

• Wajib tanya stock sebelum bayar.
• Tunggu konfirmasi admin lalu kirim FORMAT ORDER.
• Pastikan produk dan paket benar.
• Pastikan data/email/username benar.
• Kesalahan pembeli di luar tanggung jawab admin.
• Wajib SS login 1x/24 jam.
• Tanpa SS tidak ada garansi.
• Produk tanpa garansi tidak dapat komplain.
• Klaim garansi harap sabar.
• Komplain melalui chat pribadi admin.
• Jangan ubah atau bagikan akun.
• Pesanan diproses tidak dapat refund.

Dengan pembayaran, buyer dianggap menyetujui ketentuan NZstore.
`
})

}



// ADMIN

if(text=="admin"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:
`
👤 ADMIN NZstore

Bantuan order dan komplain:

Chat admin pribadi:

085828169882
`
})

}



// ADMIN PANEL

const sender=
msg.key.participant?.replace(
"@s.whatsapp.net",
""
)


if(
text=="/admin" &&
OWNER.includes(sender)
){

await sock.sendMessage(
msg.key.remoteJid,
{
text:
`
👑 NZstore ADMIN PANEL

/status
/addproduk
/hapusproduk
/broadcast

Admin aktif.
`
})

}


})


}


startBot()
