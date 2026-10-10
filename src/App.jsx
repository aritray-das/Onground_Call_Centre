import AppShell from './components/layout/AppShell'

/**
 * App — root component.
 *
 * App's only job is to render the AppShell. All layout, navigation state,
 * and content routing live inside AppShell and its children. If global
 * providers (context, theme, etc.) are added later, they wrap AppShell here.
 */
function App() {
  return <AppShell />
}

export default App
