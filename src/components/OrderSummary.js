//src/components/orderSummary.js
import React, { useMemo } from 'react';

const OrderSummary = ({ meals, onSendOrder }) => {
  const calculateMealPrice = (meal) => {
    if (!meal) return 0;
    if (meal?.soup?.name === 'Solo bandeja' || meal?.soup?.name === 'Sin sopa') {
      return meal?.soupReplacement ? 13000 : 12000;
    }
    return 13000;
  };

  const calculateTotal = () => {
    if (!meals || meals.length === 0) return 0;
    return meals.reduce((total, meal) => total + calculateMealPrice(meal), 0);
  };

  const cleanText = (text) => text?.replace(' NUEVO', '') || 'No seleccionado';

  const total = useMemo(() => calculateTotal(), [meals]);

  // Resumen de pagos
  const paymentSummary = useMemo(() => {
    if (!meals || meals.length === 0) return {};
    return meals.reduce((acc, meal) => {
      const basePrice = calculateMealPrice(meal);
      const paymentMethod = meal?.payment?.name || 'No especificado';
      if (!acc[paymentMethod]) {
        acc[paymentMethod] = 0;
      }
      acc[paymentMethod] += basePrice;
      return acc;
    }, {});
  }, [meals]);

  return (
    <div className="order-summary bg-white p-2 xs:p-4 sm:p-6 rounded-lg shadow-lg mt-4 xs:mt-6 sm:mt-8">
      <h2 className="text-sm xs:text-base sm:text-lg font-bold text-gray-800 mb-2 xs:mb-4">✅ Resumen del Pedido</h2>
      {meals.length === 0 ? (
        <div>
          <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">No hay almuerzos en tu pedido.</p>
          <p className="total-price text-[10px] xs:text-sm sm:text-base font-bold text-right mt-2">
            Total: <span className="text-green-600">$0</span>
          </p>
        </div>
      ) : (
        <div className="space-y-2 xs:space-y-4 sm:space-y-6">
          {meals.map((meal, index) => {
            const mealPrice = calculateMealPrice(meal);
            const paymentText = meal?.payment?.name || 'No especificado';
            return (
              <div key={meal.id} className="border-b pb-2 xs:pb-4 last:border-b-0">
                <h3 className="font-medium text-gray-800 mb-1 xs:mb-2 text-[10px] xs:text-xs sm:text-sm">
                  🍽 Almuerzo #{index + 1} – ${mealPrice.toLocaleString()} ({paymentText})
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 xs:gap-2 text-[10px] xs:text-xs sm:text-sm">
                  <p>🥣 Sopa: <span className="font-medium">{cleanText(meal.soup?.name)}</span></p>
                  {meal.soupReplacement && (
                    <p>Reemplazo: <span className="font-medium">{cleanText(meal.soupReplacement?.name)}</span></p>
                  )}
                  <p>🍚 Principio: <span className="font-medium">{cleanText(meal.principle?.name)}</span></p>
                  {meal.principleReplacement && (
                    <p>Reemplazo: <span className="font-medium">{cleanText(meal.principleReplacement?.name)}</span></p>
                  )}
                  <p>🍗 Proteína: <span className="font-medium">{cleanText(meal.protein?.name)}</span></p>
                  <p>🥤 Bebida: <span className="font-medium">{cleanText(meal.drink?.name)}</span></p>
                  <p>
                    🥗 Acompañamientos:{' '}
                    <span className="font-medium">
                      {Array.isArray(meal.sides) && meal.sides.length > 0
                        ? meal.sides.map(s => cleanText(s?.name)).join(', ')
                        : ''}
                    </span>
                  </p>
                  <p>📝 Notas: <span className="font-medium">{meal.notes || 'Ninguna'}</span></p>
                  <p>🕒 Entrega: <span className="font-medium">{cleanText(meal.time?.name)}</span></p>
                  <p>📍 Dirección: <span className="font-medium">{meal.address || 'No especificada'}</span></p>
                  {meal.address && (
                    <p className="text-green-600 text-[10px] xs:text-xs sm:text-sm">✅ Dirección confirmada</p>
                  )}
                  <p>💰 Pago: <span className="font-medium">{paymentText}</span></p>
                  <p>🍴 Cubiertos: <span className="font-medium">{meal.cutlery ? 'Sí' : 'No'}</span></p>
                </div>
              </div>
            );
          })}
          <div className="pt-2 xs:pt-4 border-t">
            <p className="total-price text-[10px] xs:text-sm sm:text-base font-bold text-right">
              Total: <span className="text-green-600">${total.toLocaleString()}</span>
            </p>
            <div className="mt-1 xs:mt-2 p-1 xs:p-2 bg-yellow-100 text-gray-800 text-[10px] xs:text-xs sm:text-sm rounded">
              <p><strong>💵 Resumen de pagos:</strong></p>
              {Object.entries(paymentSummary).map(([method, amount]) => (
                <p key={method}>* ${amount.toLocaleString()} – {method}</p>
              ))}
              <p className="mt-2"><strong>💰 Total: ${total.toLocaleString()}</strong></p>
              <p>🕐 Entrega estimada: 20–30 minutos.</p>
              <p>Si estás cerca del local, será aún más rápido.</p>
              <p>En caso de no tener efectivo, puedes pagar por Nequi o DaviPlata al 313 850 5647.</p>
            </div>
            <button
              onClick={onSendOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-1 xs:py-2 rounded-lg mt-2 xs:mt-4 transition-colors flex items-center justify-center text-[10px] xs:text-xs sm:text-sm"
              aria-label="Enviar pedido a WhatsApp"
            >
              <span className="mr-1 xs:mr-2">Enviar pedido a WhatsApp</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 xs:h-4 w-3 xs:w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.479 5.392 1.479 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;