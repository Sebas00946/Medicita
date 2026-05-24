import { Navigate } from 'react-router-dom';
import { useAuth }   from '../../context/AuthContext';

const PrivateRoute = ({ children, rolesPermitidos }) => {
  const { usuario, estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
};

export default PrivateRoute;
