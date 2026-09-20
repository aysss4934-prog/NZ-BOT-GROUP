const {
default: makeWASocket,
useMultiFileAuthState
}=require("@whiskeysockets/baileys")

const pino=require("pino")
const qrcode=require("qrcode-terminal")


const OWNER=[
"6285828169882"
]


async function start(){

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

if(update.qr){

qrcode.generate(
update.qr,
{
small:true
}
)

}


if(update.connection==="open"){

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


// hanya aktif di grup

if(!msg.key.remoteJid.endsWith("@g.us"))
return


const text =
msg.message.conversation || ""



// MENU

if(text.toLowerCase()=="menu"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:
`
🎀 Welcome to NZstore 🛒✨

Terima kasih sudah bergabung.

Gunakan bot untuk:

🛒 Cek produk
💰 Cek harga
📦 Bantuan order
💳 Informasi payment


🎀 NZstore MENU

Silakan pilih:

🛒 Produk
💰 Harga
📌 Rules Order
📦 Cara Order
💳 Payment
👤 Admin
❓ Bantuan


Ketik nama menu yang ingin dilihat.
`
})

}



// PAYMENT

if(text.toLowerCase()=="payment"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:
`
💳 PAYMENT NZstore

GoPay

Nomor:
085828626140

Atas Nama:
Zhraa


Setelah pembayaran:

Kirim bukti pembayaran ke admin.

Pembayaran tanpa bukti tidak dapat diproses.
`
})

}



// ORDER

if(text.toLowerCase()=="order"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:
`
📦 FORMAT ORDER NZstore

Nama:
Produk:
Paket:
Jumlah:
Metode Pembayaran:


Sebelum order wajib menunggu konfirmasi stock dari admin.
`
})

}



// RULES

if(text.toLowerCase()=="rules"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:
`
📌 RULES ORDER NZSTORE

• Sebelum TF wajib tanya stock ready/tidak.
• Tunggu konfirmasi admin, lalu kirim FORMAT ORDER.
• Wajib SS login 1x/24 jam, tanpa SS tidak ada garansi.
• Produk tanpa garansi tidak dapat komplain.
• Klaim garansi harap sabar mengikuti antrean.
• Komplain produk melalui chat pribadi admin.
• Pesanan yang sudah diproses tidak dapat refund.
• Kesalahan pembeli di luar tanggung jawab admin.
• Jangan ubah atau bagikan data akun.
`
})

}



// ADMIN

if(text.toLowerCase()=="admin"){

await sock.sendMessage(
msg.key.remoteJid,
{
text:
`
👤 ADMIN NZstore

Untuk bantuan order atau komplain produk:

Silakan chat admin pribadi.

Admin:
085828169882
`
})

}



// ADMIN PANEL

const sender =
msg.key.participant || msg.key.remoteJid


if(
text.toLowerCase()=="/admin" &&
OWNER.includes(sender.replace("@s.whatsapp.net",""))
){

await sock.sendMessage(
msg.key.remoteJid,
{
text:
`
👑 NZstore ADMIN PANEL

/status
/produk
/addproduk
/broadcast

Admin aktif.
`
})

}


})


}


start()
