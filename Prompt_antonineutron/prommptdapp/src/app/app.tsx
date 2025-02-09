import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClusterProvider } from '../components/cluster/cluster-data-access'
import { SolanaProvider } from '../components/solana/solana-provider'
import { AppRoutes } from './app-routes'
import { useEffect } from 'react'
import DashboardFeature from '@/components/dashboard/dashboard-feature'

const client = new QueryClient()

export function App() {
  useEffect(() => {
    console.log("HOLLANANAN");
    
  });
  return (
    <QueryClientProvider client={client}>
      <ClusterProvider>
        <SolanaProvider>
          <DashboardFeature/>
        </SolanaProvider>
      </ClusterProvider>
    </QueryClientProvider>
  )
}
