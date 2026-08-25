import BasicPage from '../BasicPage/BasicPage'
import SearchPage from '../SearchPage/SearchPage'
import DocumentationPage from '../DocumentationPage/DocumentationPage'
import type { PageData } from './PageRenderingTemplate.types'
import './PageRenderingTemplate.css'

export default function PageRenderingTemplate({ data }: { data: unknown }) {
  const page = data as PageData

  switch (page.template) {
    case 'basic':
      return <BasicPage data={page} />
    case 'search':
      return <SearchPage data={page} />
    case 'documentation':
      return <DocumentationPage data={page} />
  }
}
