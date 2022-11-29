import constate from 'constate';
import React from 'react';
import { api } from 'src/services/api.service';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { handlerError } from 'src/helpers/error/handlerError';

export type Product = {
  id: string;
  name: string;
  sale_price?: number;
  cost_price?: number;
  processes: {
    id: string;
    name: string;
  }[];
};

const useProducts = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const { data } = await api.get('/products');

      setProducts(data);
    } catch (error) {
      handlerError(error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchProductById(id: string) {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);

      setProduct(data);
    } catch (error) {
      handlerError(error);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function createProduct(data: any) {
    setIsLoading(true);
    try {
      const { data: _data } = await api.post(`/products`, data);

      router.push('/products');
    } catch (error) {
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProduct(data: any) {
    setIsLoading(true);
    try {
      const { data: _data } = await api.patch(`/products/${product?.id}`, data);

      router.push('/products');
    } catch (error) {
      handlerError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    const willDelete = confirm(
      'Tem certeza que deseja excluir esse produto? Essa ação é irreversível'
    );

    if (!willDelete) {
      return;
    }

    try {
      const { data: _data } = await api.delete(`/products/${id}`);

      fetchProducts();
    } catch (error) {
      handlerError(error);
    }
  }

  async function addProcessesToProduct(
    product_id: string,
    processes_id: string[]
  ) {
    setIsLoading(true);
    try {
      const { data: _data } = await api.patch(
        `/products/add-processes/${product_id}`,
        {
          processes_id,
        }
      );

      toast('Processos atualizados com sucesso!', { type: 'success' });
    } catch (error) {
      handlerError(error);

      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    state: {
      products,
      product,
      isLoading,
    },
    effects: {
      fetchProducts,
      fetchProductById,
      deleteProduct,
      createProduct,
      updateProduct,
      addProcessesToProduct,
    },
  };
};

export const [ProductsProvider, useProductsState, useProductsEffects] =
  constate(
    useProducts,
    (value) => value.state,
    (value) => value.effects
  );
