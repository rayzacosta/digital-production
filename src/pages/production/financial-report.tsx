import Head from 'next/head';
import React from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { DateRange, DateValues } from 'src/components/DateRange/DateRange';
import { formatCurrency } from 'src/helpers/currency';
import withProvider from 'src/hocs/withProvider';
import {
  FinancialReportProvider,
  useFinancialReportEffects,
  useFinancialReportState,
} from 'src/providers/financialReport.provider';
import {
  ProductsProvider,
  useProductsEffects,
  useProductsState,
} from 'src/providers/products.provider';

const FinancialReport = withProvider(
  FinancialReportProvider,
  ProductsProvider
)(() => {
  const [period, setPeriod] = React.useState<DateValues>({
    endDate: null,
    startDate: null,
  });
  const [selectedProduct, setSelectedProduct] = React.useState('');

  const { fetchFinancialReport } = useFinancialReportEffects();
  const { financialReport, isLoading } = useFinancialReportState();
  const { fetchProducts } = useProductsEffects();
  const { products } = useProductsState();

  const handleFetch = () => {
    if (!period.startDate || !period.endDate) {
      toast.info('Preencha o período para fazer a consulta');
      return;
    }

    fetchFinancialReport(period.startDate, period.endDate, selectedProduct);
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container className="pt-5">
      <Head>
        <title>Relatório Financeiro - Digital Production</title>
      </Head>

      <h1 className="mb-5">
        <b>Relatório Financeiro</b>
      </h1>

      <Row className="mb-5">
        <Col sm="12" md="6">
          <Form.Group className="">
            <Form.Label>Produto</Form.Label>

            <Form.Select onChange={(e) => setSelectedProduct(e.target.value)}>
              <option value="">Selecione um Produto</option>
              {products.map((product) => {
                return (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col sm="8" md="4">
          <DateRange value={period} onChange={setPeriod} label="Período" />
        </Col>
        <Col
          sm="4"
          md="2"
          className="d-flex align-items-end justify-content-end pb-2"
        >
          <Button onClick={handleFetch}>
            {isLoading && <Spinner animation="border" size="sm" />}
            Buscar
          </Button>
        </Col>
      </Row>

      {financialReport?.products.map((product) => {
        const financial = product.financial;

        return (
          <Row key={product.id}>
            <Col>
              <Card>
                <Card.Header>
                  <b>{product.name}</b>
                </Card.Header>
                <Card.Body>
                  <p>
                    <b>Custo de produção por peça:</b>{' '}
                    {formatCurrency(financial.cost_price)}
                  </p>
                  <p>
                    <b>Valor venda por peça:</b>{' '}
                    {formatCurrency(financial.sale_price)}
                  </p>

                  <p>
                    <b>Total de peças produzidas:</b>{' '}
                    {financial.amount_produced}
                  </p>

                  <p>
                    <b>Custo total bruto de fabricação:</b>{' '}
                    {formatCurrency(financial.amount_cost_value)}
                  </p>
                  <p className="mb-0">
                    <b>Valor total venda:</b>{' '}
                    {formatCurrency(financial.amount_sale_value)}
                  </p>
                </Card.Body>

                <Card.Footer>
                  <div className="d-flex align-items-center justify-content-between">
                    <b>Lucro</b>

                    <Badge className="fw-bold bg-success fs-2">
                      {formatCurrency(financial.profit)}
                    </Badge>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
});

export default FinancialReport;
