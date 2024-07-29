export function SectionKitComponents() {
    return (
      <div className="grid grid-cols-2">
        <div>
          <h3>Optimized Headless Components</h3>
          <ul className="text-gray-400">
            <li>Tabs</li>
            <li>Modals</li>
            <li>Forms</li>
            <li>Toasts</li>
            <li>More...</li>
          </ul>
        </div>
        <div>
          <p>Observable helpers</p>
          <ul className="text-gray-400">
            <li>Current date & time</li>
            <li>createDraft</li>
            <li>stringAsNumber</li>
            <li>setAsString</li>
            <li>More...</li>
          </ul>
        </div>
        <div>
          <p>React hooks</p>
          <ul className="text-gray-400">
            <li>useMeasure</li>
            <li>usePosition</li>
            <li>useScrolled</li>
            <li>useHover</li>
            <li>More...</li>
          </ul>
        </div>
        <div>
          <p>Framework-specific hooks</p>
          <ul className="text-gray-400">
            <li>useRoutes</li>
            <li>useRouteHistory</li>
            <li>useCanRender</li>
            <li>usePauseProvider</li>
            <li>More...</li>
          </ul>
        </div>
      </div>
    );
}
