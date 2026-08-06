import 'dotenv/config';
import { Bot, Keyboard, InlineKeyboard } from 'grammy';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
const ADMIN_ID = Number(process.env.ADMIN_TELEGRAM_ID);

const estadoNegocio = {
  ubicacionActual: null,
  enRutaDelivery: false,
  stockMochila: {
    panes: 15,
    queso: true,
    jamon: true,
    nutella: true,
    verdurasFrescas: true
  }
};

const esAdmin = (ctx) => ctx.from?.id === ADMIN_ID;

bot.command('start', async (ctx) => {
  if (!esAdmin(ctx)) {
    return ctx.reply('👋 ¡Bienvenido a Que-CuernoS! La mini app abrirá pronto.');
  }

  const menuAdminKeyboard = new Keyboard()
    .text('📍 Actualizar GPS (Radio 2km)').text('📦 Stock al Vuelo').row()
    .text('📊 Reporte de Ventas').text('🔓 Aprobar Efectivo').row()
    .resized();

  await ctx.reply(
    `👑 **¡Bienvenido al Panel Admin de Que-CuernoS!**\n\n` +
    `Estado actual:\n` +
    `• GPS Activo: ${estadoNegocio.ubicacionActual ? '✅ En línea' : '❌ Sin Ubicación'}\n` +
    `• Modo Delivery: ${estadoNegocio.enRutaDelivery ? '🚴 En Calle' : '🏠 En Cocina'}`,
    { reply_markup: menuAdminKeyboard, parse_mode: 'Markdown' }
  );
});

bot.on('message:location', async (ctx) => {
  if (!esAdmin(ctx)) return;

  const { latitude, longitude } = ctx.message.location;
  estadoNegocio.ubicacionActual = { lat: latitude, lng: longitude };
  estadoNegocio.enRutaDelivery = true;

  await ctx.reply(
    `📍 **Ubicación Actualizada con Éxito**\n\n` +
    `Coordenadas: \`${latitude}, ${longitude}\`\n` +
    `🎯 Radio de 2 km activado para clientes cercanos.\n` +
    `🛵 Modo "Delivery al Vuelo" encendido.`,
    { parse_mode: 'Markdown' }
  );
});

bot.hears('📦 Stock al Vuelo', async (ctx) => {
  if (!esAdmin(ctx)) return;

  const inlineKeyboard = new InlineKeyboard()
    .text(`🥐 Panes disponible: ${estadoNegocio.stockMochila.panes}`, 'stock_panes').row()
    .text(`🧀 Queso: ${estadoNegocio.stockMochila.queso ? '✅' : '❌'}`, 'toggle_queso')
    .text(`🥓 Jamón: ${estadoNegocio.stockMochila.jamon ? '✅' : '❌'}`, 'toggle_jamon').row()
    .text(`🍫 Nutella: ${estadoNegocio.stockMochila.nutella ? '✅' : '❌'}`, 'toggle_nutella');

  await ctx.reply('📦 **Inventario de Mochila (En Calle):**', {
    reply_markup: inlineKeyboard,
    parse_mode: 'Markdown'
  });
});

bot.hears('📊 Reporte de Ventas', async (ctx) => {
  if (!esAdmin(ctx)) return;

  await ctx.reply(
    `📊 **Resumen de Hoy:**\n\n` +
    `💰 Total: $0.00 MXN\n` +
    `💳 SPEI/Tarjeta: 0 pedidos\n` +
    `💵 Efectivo: 0 pedidos\n` +
    `🪙 Cripto: 0 pedidos`
  );
});

bot.start();
console.log('🤖 Super Bot Admin encendido y escuchando...');
// Comando exclusivo para ti
bot.command('admin', (ctx) => {
  const MI_TELEGRAM_ID = 8526499219; // Tu ID real de Telegram

  if (ctx.from.id === MI_TELEGRAM_ID) {
    ctx.reply("Bienvenido Jefe. Accede al panel:", {
      reply_markup: {
        inline_keyboard: [[
          { text: "⚙️ Abrir Admin", web_app: { url: "https://que-cuernos-bot.onrender.com" } }
        ]]
      }
    });
  } else {
    ctx.reply("❌ No tienes permisos para acceder aquí.");
  }
});

import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  // Servir el archivo admin.html si se solicita o por defecto
  const filePath = path.resolve('public/admin.html');
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Bot activo y escuchando...');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    }
  });
}).listen(PORT);