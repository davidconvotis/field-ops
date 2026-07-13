import OrdersList from '../components/OrdersList.jsx';

export default function ClientOrders() {
  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h2 className="text-2xl font-semibold text-slate-800">Mis órdenes</h2>
      <OrdersList />
    </div>
  );
}
