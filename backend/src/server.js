require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi    = require('swagger-ui-express');
const swaggerSpec  = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes    = require('./modules/auth/auth.routes');
const citasRoutes   = require('./modules/citas/citas.routes');
const medicosRoutes = require('./modules/medicos/medicos.routes');
const especialidadesRoutes = require('./modules/especialidades/especialidades.routes');
const consultoriosRoutes = require('./modules/consultorios/consultorios.routes');
const agendasRoutes = require('./modules/agendas/agendas.routes');
const rolesRoutes = require('./modules/roles/roles.routes');
const formulariosRoutes = require('./modules/formularios/formularios.routes');
const reportesRoutes = require('./modules/reportes/reportes.routes');

const app  = express();
const PORT = process.env.PORT || 4000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas solicitudes desde esta IP, intenta nuevamente en 15 minutos'
});

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use('/api', limiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth',    authRoutes);
app.use('/api/citas',   citasRoutes);
app.use('/api/medicos', medicosRoutes);
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/consultorios', consultoriosRoutes);
app.use('/api/agendas', agendasRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/formularios', formulariosRoutes);
app.use('/api/reportes', reportesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok', version: '1.0.0', proyecto: 'MediCita Web' });
});

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor MediCita Web corriendo en http://localhost:${PORT}`);
  console.log(`📖 Swagger UI disponible en http://localhost:${PORT}/api-docs`);
});
