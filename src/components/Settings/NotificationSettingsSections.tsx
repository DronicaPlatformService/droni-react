import { Switch } from '@headlessui/react';
import { type JSX, useState } from 'react';

interface NotificationSettingItem {
  id: string;
  label: string;
  description: string;
  initialEnabled: boolean;
}

const notificationItems: Omit<NotificationSettingItem, 'initialEnabled'>[] = [
  { id: 'appPush', label: '앱 푸시 알림', description: '앱에 관련된 알림을 보내드려요' },
  { id: 'kakaoTalk', label: '카카오톡 알림', description: '카카오톡으로 알림을 안내 해드려요' },
  { id: 'chat', label: '채팅 알림', description: '새로운 채팅이 오면 안내 해드려요' },
  { id: 'quote', label: '견적 알림', description: '새로운 견적이 입찰되면 안내 해드려요' },
];

interface NotificationSettingsSectionProps {
  className?: string;
}

/**
 * @description 알림 설정을 관리하는 섹션 컴포넌트입니다.
 * @param {NotificationSettingsSectionProps} props - 컴포넌트 props
 */
export const NotificationSettingsSection = ({
  className,
}: NotificationSettingsSectionProps): JSX.Element => {
  const [enabledSettings, setEnabledSettings] = useState<Record<string, boolean>>({
    appPush: true,
    kakaoTalk: true,
    chat: true,
    quote: true,
  });

  const handleToggle = (id: string) => {
    setEnabledSettings((prev) => ({ ...prev, [id]: !prev[id] }));
    // TODO: 실제 API 호출 또는 상태 저장 로직 추가
    console.log(`Setting ${id} toggled to ${!enabledSettings[id]}`);
  };

  return (
    <section className={`flex flex-col bg-white p-5 font-spoqa tracking-tight-1pct ${className}`}>
      <h3 className="text-system-05 text-gray-800">알림 설정</h3>

      {notificationItems.map((item) => (
        <div key={item.id} className="mt-4 flex items-center justify-between">
          <label htmlFor={item.id} className="flex-grow cursor-pointer">
            <div className="text-system-07 text-gray-800">{item.label}</div>
            <div className="text-system-10 text-gray-600">{item.description}</div>
          </label>
          <div>
            <Switch
              id={item.id}
              checked={enabledSettings[item.id]}
              onChange={() => handleToggle(item.id)}
              className="group inline-flex h-5.5 w-9.5 items-center rounded-full bg-gray-200 transition data-checked:bg-droni-blue-500"
            >
              <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-4.5" />
            </Switch>
          </div>
        </div>
      ))}
    </section>
  );
};
