import React from 'react';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  Column,
  useSortBy,
  TableState,
} from 'react-table';
import { Icon } from '@iconify/react';
import { Card, Col, Image, Pagination, Row } from 'react-bootstrap';


export type TableProps = {
  columns: Column[];
  data: any;
  isLoading?: boolean;
  handleRowClick?: (row: any) => void;
  initialState?: Partial<TableState>;
};

export function Table({
  columns: _columns,
  data,
  isLoading,
  handleRowClick,
  initialState,
}: TableProps) {
  const columns = React.useMemo(() => _columns, [_columns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // setGlobalFilter,
    state,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  ) as any;

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Card>
      {/* <Card.Header>
        <Row className="align-items-center">
          <Col>
            <GlobalFilter
              preGlobalFilteredRows={globalFilter}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </Col>
        </Row>
      </Card.Header> */}
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup: any, i: number) => (
            // eslint-disable-next-line
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                // eslint-disable-next-line
                <th {...column.getHeaderProps()}>
                  {
                    <span className="d-flex justify-content-between">
                      <div className="me-2">{column.render('Header')}</div>
                    </span>
                    /* Add a sort direction indicator */
                  }
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {!isLoading && !page.length && (
          <div
            role="rowgroup"
            style={{marginLeft: '70%'}}
            className="d-flex flex-column align-items-center w-100 gap-3 p-5"
          >
            <Image
              src="https://res.cloudinary.com/dpmunc2ma/image/upload/v1669690681/digital-production/assets/images/tooltip-bar_sondjv.png"
              alt="Representação não há dados"
              width={150}
            />

            <h1 className="mb-0">Não há dados para listar</h1>
          </div>
        )}
        <tbody {...getTableBodyProps()} className="fs-base bg-white list">
          {isLoading ? (
            <>
              {Array.from({ length: 5 }).map((_: any, rowIdx) => {
                return (
                  <tr key={`loading-row-${rowIdx}`}>
                    {columns.map((col, colIdx) => {
                      return (
                        <td key={`loading-col-${colIdx}`}>
                          <span
                            className="skeleton-box rounded"
                            style={{ height: '12px', width: '100%' }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </>
          ) : (
            <>
              {page.map((row: any) => {
                prepareRow(row);
                return (
                  // eslint-disable-next-line
                  <tr
                    // className={styles.row}
                    {...row.getRowProps()}
                    onClick={() => handleRowClick?.(row.original)}
                    role={handleRowClick ? 'button' : undefined}
                  >
                    {row.cells.map((cell: any) => {
                      return (
                        // eslint-disable-next-line
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </table>
      <Card.Footer className="d-flex justify-content-between">
        <Pagination className="card-pagination pagination-tabs">
          <Pagination.Item
            className="ps-0 pe-4 border-end"
            disabled={!canPreviousPage}
            onClick={() => previousPage()}
          >
            {/* <Icon icon="arrow-left" size="1em" className="me-1" />  */}
            Anterior
          </Pagination.Item>
        </Pagination>
        <Pagination className="card-pagination pagination-tabs">
          {pageOptions.map((option: any, index: number) => (
            <Pagination.Item
              key={index}
              active={option === pageIndex}
              onClick={() => gotoPage(option)}
            >
              {option + 1}
            </Pagination.Item>
          ))}
        </Pagination>
        <Pagination className="card-pagination pagination-tabs">
          <Pagination.Item
            className="ps-4 pe-0 border-start"
            disabled={!canNextPage}
            onClick={() => nextPage()}
          >
            Próximo{' '}
            {/* <FeatherIcon icon="arrow-right" size="1em" className="ms-1" /> */}
          </Pagination.Item>
        </Pagination>
      </Card.Footer>
    </Card>
  );
}
