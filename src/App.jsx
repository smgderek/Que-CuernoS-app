import React, { useState, useEffect } from 'react';

// Productos de prueba para "Que Cuernos"
const MENU_ITEMS = [
  {
    id: 'burger-cuernos',
    name: '🍔 Hamburguesa Que Cuernos',
    price: 120,
    description: 'Doble carne smash, queso cheddar derretido, tocino crujiente y salsa secreta.',
    ingredients: ['Doble Carne', 'Queso Cheddar', 'Tocino', 'Cebolla Caramelizada', 'Salsa Especial']
  },
  {
    id: 'fries-cuernos',
    name: '🍟 Papas Acarameladas',
    price: 65,
    description: 'Papas sazonadas con especies de la casa y baño de queso fundido.',
    ingredients: ['Papas Crocantes', 'Queso Fundido', 'Tocino Bitz']
  },
  {
    id: 'shake-cuernos',
    name: '🥤 Malteada Cuernos Pro',
    price: 75,
    description: 'Cremosa malteada de chocolate cremoso con toppings de galleta.',
    ingredients: ['Base Chocolate', 'Crema Batida', 'Topping Galleta']
  }
];

export default function App() {
  const [screen, setScreen] = useState('vitrina'); // 'vitrina', 'cocina', 'caja'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customIngredients, setCustomIngredients] = useState([]);
  const [cart, setCart] = useState([]);

  // Integración con Telegram Web App SDK si está presente
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  // Abrir La Cocina para personalizar un producto
  const handleStartCustomization = (product) => {
    setSelectedProduct(product);
    setCustomIngredients([...product.ingredients]); // Copia inicial de ingredientes
    setScreen('cocina');
  };

  // Agregar o quitar ingredientes en La Cocina
  const toggleIngredient = (ing) => {
    if (customIngredients.includes(ing)) {
      setCustomIngredients(customIngredients.filter((i) => i !== ing));
    } else {
      setCustomIngredients([...customIngredients, ing]);
    }
  };

  // Confirmar producto personalizado y agregar al carrito
  const handleAddToCart = () => {
    const itemToAdd = {
      ...selectedProduct,
      cartId: Date.now(),
      chosenIngredients: customIngredients,
    };
    setCart([...cart, itemToAdd]);
    setScreen('vitrina');
  };

  // Calcular total del pedido
  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={styles.container}>
      {/* HEADER / NAVEGACIÓN */}
      <header style={styles.header}>
        <h1 style={styles.logo}>🔥 Que Cuernos</h1>
        <div style={styles.badge}>Modo 2D Rápido</div>
      </header>

      {/* PILAR 1: LA VITRINA (MENÚ PRINCIPAL) */}
      {screen === 'vitrina' && (
        <main style={styles.content}>
          <h2 style={styles.sectionTitle}>Menú Rápido ⚡</h2>
          <div style={styles.grid}>
            {MENU_ITEMS.map((item) => (
              <div key={item.id} style={styles.card}>
                <h3>{item.name}</h3>
                <p style={styles.desc}>{item.description}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.price}>${item.price} MXN</span>
                  <button
                    style={styles.btnPrimary}
                    onClick={() => handleStartCustomization(item)}
                  >
                    Personalizar 🛠️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* BARRA INFERIOR DEL CARRITO */}
          {cart.length > 0 && (
            <div style={styles.cartBar}>
              <div>
                <strong>{cart.length} productos</strong>
                <div style={{ fontSize: '0.85rem' }}>Total: ${totalAmount} MXN</div>
              </div>
              <button style={styles.btnSuccess} onClick={() => setScreen('caja')}>
                Ir a la Caja 🛒
              </button>
            </div>
          )}
        </main>
      )}

      {/* PILAR 2: LA COCINA (PERSONALIZACIÓN DE INGREDIENTES) */}
      {screen === 'cocina' && selectedProduct && (
        <main style={styles.content}>
          <button style={styles.btnBack} onClick={() => setScreen('vitrina')}>
            ⬅️ Volver al menú
          </button>
          <h2>👨‍🍳 La Cocina</h2>
          <p style={styles.desc}>
            Personaliza tu <strong>{selectedProduct.name}</strong> quita o pon lo que quieras:
          </p>

          <div style={styles.ingredientsList}>
            {selectedProduct.ingredients.map((ing) => {
              const isIncluded = customIngredients.includes(ing);
              return (
                <div
                  key={ing}
                  style={{
                    ...styles.ingredientChip,
                    backgroundColor: isIncluded ? '#2ed573' : '#747d8c',
                  }}
                  onClick={() => toggleIngredient(ing)}
                >
                  {isIncluded ? '✅ ' : '❌ Sin '} {ing}
                </div>
              );
            })}
          </div>

          <button style={{ ...styles.btnPrimary, marginTop: '20px', width: '100%' }} onClick={handleAddToCart}>
            Agregar al pedido por ${selectedProduct.price} MXN
          </button>
        </main>
      )}

      {/* PILAR 3: LA CAJA (CHECKOUT & CONFIRMACIÓN) */}
      {screen === 'caja' && (
        <main style={styles.content}>
          <button style={styles.btnBack} onClick={() => setScreen('vitrina')}>
            ⬅️ Seguir pidiendo
          </button>
          <h2>💳 La Caja / Resumen</h2>

          <div style={styles.summaryBox}>
            {cart.map((item, idx) => (
              <div key={item.cartId} style={styles.summaryItem}>
                <div>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#aaa' }}>
                    {item.chosenIngredients.join(', ')}
                  </div>
                </div>
                <span>${item.price}</span>
              </div>
            ))}
            <hr style={{ borderColor: '#333', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>Total a pagar:</span>
              <span style={{ color: '#2ed573' }}>${totalAmount} MXN</span>
            </div>
          </div>

          <button
            style={{ ...styles.btnSuccess, width: '100%', marginTop: '20px', padding: '15px' }}
            onClick={() => {
              alert('¡Pedido enviado con éxito a La Cocina de Que Cuernos!');
              setCart([]);
              setScreen('vitrina');
            }}
          >
            Confirmar y Enviar Pedido 🚀
          </button>
        </main>
      )}
    </div>
  );
}

// ESTILOS LIMPIOS Y RESPONSIVOS PARA MÓVIL
const styles = {
  container: {
    backgroundColor: '#181818',
    color: '#fff',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    paddingBottom: '80px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#0f0f0f',
    borderBottom: '1px solid #2a2a2a',
  },
  logo: { margin: 0, fontSize: '1.2rem', color: '#ff4757' },
  badge: { backgroundColor: '#2f3542', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px' },
  content: { padding: '20px' },
  sectionTitle: { fontSize: '1.2rem', marginBottom: '15px' },
  grid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: {
    backgroundColor: '#222',
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid #333',
  },
  desc: { fontSize: '0.85rem', color: '#ccc', margin: '8px 0' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  price: { fontWeight: 'bold', fontSize: '1.1rem', color: '#ff6b81' },
  btnPrimary: {
    backgroundColor: '#ff4757',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  btnSuccess: {
    backgroundColor: '#2ed573',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  btnBack: {
    backgroundColor: 'transparent',
    color: '#ff4757',
    border: 'none',
    padding: '0',
    marginBottom: '15px',
    cursor: 'pointer',
  },
  cartBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2f3542',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 -4px 10px rgba(0,0,0,0.5)',
  },
  ingredientsList: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' },
  ingredientChip: {
    padding: '10px 15px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    userSelect: 'none',
  },
  summaryBox: { backgroundColor: '#222', padding: '15px', borderRadius: '12px', marginTop: '15px' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
};