import { Header } from './Header';
import { List } from './List';
import { Text } from './Text';

export function SectionKitComponents() {
    return (
        <div className="mt-subsection px-4">
            <Header size="h3">📚 Tons of tools to get started quickly (Coming soon)</Header>
            <Text className="max-w-4xl">
                Legend Kit includes tons of high performance headless components, general purpose observables,
                transformer computeds, React hooks that don't re-render, and observable tools for popular frameworks.
                The core packages are free and the more advanced ones are premium.
            </Text>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm sm:gap-4 sm:text-base">
                {/* <List title="Optimized Components" items={['Tabs', 'Modals', 'Forms', 'Toasts', 'More...']} border /> */}
                <List
                    title="Integrations between Legend tools"
                    items={['Legend State', 'Legend List', 'Legend Motion', 'More...']}
                    border
                />

                <List
                    title="Observable helpers"
                    items={['currentDate', 'createDraft', 'stringAsNumber', 'setAsString', 'More...']}
                    border
                />
                <List
                    title="React hooks"
                    items={['useMeasure', 'usePosition', 'useScrolled', 'useHover', 'More...']}
                    border
                />
                <List
                    title="Framework hooks"
                    items={['useRoutes', 'useRouteHistory', 'useCanRender', 'usePauseProvider', 'More...']}
                    border
                />
            </div>
        </div>
    );
}
