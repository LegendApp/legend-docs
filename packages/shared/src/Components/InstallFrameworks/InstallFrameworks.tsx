import { observer } from '@legendapp/state/react';
import classNames from 'classnames';
import { state$ } from '../../state';
import { InstallCode, InstallTabs } from '../Install/Install';

export const InstallFrameworks = observer(function ({ className }: { className?: string }) {
    const name = '@legendapp/state@beta';
    const framework = state$.framework.get();
    return (
        <div className={classNames('mt-6', className)}>
            <InstallTabs name={name} />
            <InstallCode name={name} />
            {framework === 'React Native' && (
                <div>
                    <div>And if you want to use persistence, install your preferred storage plugin</div>
                    <InstallCode name="react-native-mmkv" />
                    <div className="!mt-2 -mb-2">or</div>
                    <InstallCode name="@react-native-async-storage/async-storage" />
                </div>
            )}
        </div>
    );
});
