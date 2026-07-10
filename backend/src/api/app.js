const express = require('express');
const ordersRouter = require('./orders');
const executionsRouter = require('./executions');
const reviewsRouter = require('./reviews');
const techniciansRouter = require('./technicians');
const errorHandler = require('../middleware/errorHandler');
const tlsEnforce = require('../middleware/tlsEnforce');
const { scheduleRetentionJob } = require('../adapters/retentionJob');

const app = express();
app.use(tlsEnforce);
app.use(express.json());

app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/orders', executionsRouter);
app.use('/api/v1/orders', reviewsRouter);
app.use('/api/v1/technicians', techniciansRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

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
