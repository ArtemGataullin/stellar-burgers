import { useNavigate } from 'react-router-dom';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';

export function OrderModal() {
  const navigate = useNavigate();

  return (
    <Modal title='' onClose={() => navigate(-1)}>
      <OrderInfo />
    </Modal>
  );
}
