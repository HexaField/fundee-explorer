import { Component, For, Show } from 'solid-js'

export interface Funding {
  type?: string
  url?: string
}

export interface Dependency {
  name: string
  version?: string
  funding?: Funding | Funding[]
  dependencies?: Record<string, Dependency>
}

interface DependencyCardProps {
  name: string
  dependency: Dependency
}

const DependencyCard: Component<DependencyCardProps> = (props) => {
  const fundingSources = () => {
    const f = props.dependency.funding
    if (!f) return []
    return Array.isArray(f) ? f : [f]
  }

  const hasFunding = () => fundingSources().length > 0

  return (
    <div class="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div class="flex flex-wrap items-center gap-3">
        <h3 class="text-lg font-semibold text-gray-800">{props.name}</h3>
        <Show when={props.dependency.version}>
          <span class="text-xs text-gray-500">v{props.dependency.version}</span>
        </Show>

        <Show when={hasFunding()}>
          <div class="flex flex-wrap gap-2 items-center ml-auto sm:ml-0">
            <For each={fundingSources()}>
              {(fund) => (
                <a
                  href={fund.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  {fund.type || 'Support'}
                </a>
              )}
            </For>
          </div>
        </Show>
      </div>

      <Show when={props.dependency.dependencies}>
        <div class="mt-4 pl-4 border-l-2 border-gray-100">
          <For each={Object.entries(props.dependency.dependencies || {})}>
            {([depName, depData]) => (
              <Show when={depData.funding || (depData.dependencies && Object.keys(depData.dependencies).length > 0)}>
                <DependencyCard name={depName} dependency={depData} />
              </Show>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default DependencyCard
