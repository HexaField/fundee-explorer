import { Component, createSignal, For, Show } from 'solid-js'
import DependencyCard, { Dependency } from './DependencyCard'

const EcosystemMapper: Component = () => {
  const [packageName, setPackageName] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [data, setData] = createSignal<Dependency | null>(null)

  const handleAnalyze = async () => {
    if (!packageName()) return

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch('http://localhost:3001/api/analyze-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ packageName: packageName() })
      })

      if (!response.ok) {
        const errData = (await response.json()) as { error?: string }
        throw new Error(errData.error || 'Failed to analyze package')
      }

      const result = (await response.json()) as Dependency
      setData(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="max-w-4xl mx-auto p-6">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Fundee Explorer</h1>
        <p class="text-gray-600">Visualize the invisible funding ecosystem of any NPM package.</p>
      </div>

      <div class="flex gap-4 mb-8 justify-center">
        <input
          type="text"
          value={packageName()}
          onInput={(e) => setPackageName(e.currentTarget.value)}
          placeholder="Enter package name (e.g. react, lodash)"
          class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void handleAnalyze()
            }
          }}
        />
        <button
          onClick={() => void handleAnalyze()}
          disabled={loading() || !packageName()}
          class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading() ? 'Mapping...' : 'Map Ecosystem'}
        </button>
      </div>

      <Show when={loading()}>
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-500">Mapping dependencies... this may take a moment.</p>
        </div>
      </Show>

      <Show when={error()}>
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error()}</div>
      </Show>

      <Show when={data()}>
        <div class="space-y-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Results for {packageName()}</h2>
            <span class="text-sm text-gray-500">
              {/* We could count fundable deps here if we traversed the tree */}
            </span>
          </div>

          {/* The root object from npm fund is the workspace itself usually, or the package if installed directly. 
              If we used npm install <pkg>, the root is our dummy project, and <pkg> is a dependency.
          */}
          <Show
            when={data()?.dependencies && Object.keys(data()?.dependencies || {}).length > 0}
            fallback={<div class="text-center text-gray-500 py-8">No fundable dependencies found.</div>}
          >
            <For each={Object.entries(data()?.dependencies || {})}>
              {([name, dep]) => <DependencyCard name={name} dependency={dep} />}
            </For>
          </Show>
        </div>
      </Show>
    </div>
  )
}

export default EcosystemMapper
