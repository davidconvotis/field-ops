import type { Request, Response } from 'express';

const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./auth');
const ordersRouter = require('./orders');
const executionsRouter = require('./executions');
const reviewsRouter = require('./reviews');
const techniciansRouter = require('./technicians');
const clientsRouter = require('./clients');
const errorHandler = require('../middleware/errorHandler');
const tlsEnforce = require('../middleware/tlsEnforce');
const { scheduleRetentionJob } = require('../adapters/retentionJob');

const app = express();
app.use(tlsEnforce);
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/orders', executionsRouter);
app.use('/api/v1/orders', reviewsRouter);
app.use('/api/v1/technicians', techniciansRouter);
app.use('/api/v1/clients', clientsRouter);

app.get('/health', (req: Request, res: Response) => res.json({ status: 'ok' }));

app.use(errorHandler);

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`FieldOps backend escuchando en :${port}`);
  });
  scheduleRetentionJob();
}

module.exports = app;
// smoke test ci-develop-back
// smoke test ci-develop-back 2
// smoke test ci-develop-back 3
