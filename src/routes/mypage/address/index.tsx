import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AddressCard } from '@/components/Address/AddressCard';
import { AddressLayout } from '@/components/Address/AddressLayout';
import { requireAuth } from '@/lib/authGuard';

export interface Address {
  id: number;
  farmName: string;
  name: string;
  phone: string;
  address1: string;
  address2: string;
}

// TODO: API 연동 후 실제 데이터로 교체
const mockAddresses: Address[] = [
  {
    id: 1,
    farmName: '양지 농원',
    name: '이종현',
    phone: '010-0000-0000',
    address1: '충청남도 예산군 예산읍 예산로 194,',
    address2: '양지 농원',
  },
  {
    id: 2,
    farmName: 'OO 농원',
    name: '이종현',
    phone: '010-0000-0000',
    address1: '충청남도 예산군 예산읍 예산로 194,',
    address2: '양지 농원',
  },
];

export const Route = createFileRoute('/mypage/address/')({
  beforeLoad: requireAuth,
  component: AddressManagementScreen,
  context: (ctx) => ({ ...ctx.context, hideBottomNav: true }),
});

function AddressManagementScreen() {
  const navigate = useNavigate();

  const handleAddAddressClick = () => {
    navigate({ to: '/mypage/address/add' });
  };

  return (
    <AddressLayout buttonText="주소지 추가" onButtonClick={handleAddAddressClick}>
      <div className="ml-5 text-system-01 tracking-[-0.2px]">
        자주 사용하시는 주소지를
        <br />
        등록, 관리하실 수 있어요
      </div>

      <div className="flex flex-col space-y-2.5 p-5">
        {mockAddresses.length > 0 ? (
          mockAddresses.map((addr, idx) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isDefault={idx === 0}
              // TODO: 실제 수정/삭제 핸들러 연결
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-500">등록된 주소지가 없습니다.</p>
            <p className="text-gray-500 text-sm">새로운 주소지를 추가해보세요.</p>
          </div>
        )}
      </div>
    </AddressLayout>
  );
}
