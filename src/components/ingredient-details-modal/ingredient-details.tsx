import { useNavigate } from 'react-router-dom';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details/ingredient-details';

export function IngredientDetailsModal() {
  const navigate = useNavigate();

  return (
    <Modal title='' onClose={() => navigate(-1)}>
      <IngredientDetails />
    </Modal>
  );
}
