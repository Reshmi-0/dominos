import React, { useEffect, useState } from 'react';
import { Store, User, Clock, Bell, CreditCard, Sliders } from 'lucide-react';
import { SettingsCard, FormField, ToggleRow, CheckboxRow } from '../components/settings/SettingsComponents';
import { api } from '../data/mockDashboardApi';
import type { StoreSettings } from '../data/types';

export function Settings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [editStore, setEditStore] = useState(false);
  const [editHours, setEditHours] = useState(false);
  const [editAccount, setEditAccount] = useState(false);
  const [editPrefs, setEditPrefs] = useState(false);
  const [editNotifs, setEditNotifs] = useState(false);
  const [editPayment, setEditPayment] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  if (!settings) {
    return <div className="flex items-center justify-center h-64 text-text-secondary">Loading settings...</div>;
  }

  const handleSave = async () => {
    setSaving(true);
    if (settings) {
      await api.updateSettings(settings);
    }
    setTimeout(() => setSaving(false), 500); // UI feedback delay
  };

  const update = (category: keyof StoreSettings, field: string, value: any) => {
    setSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [category]: {
          ...(prev[category] as any),
          [field]: value
        }
      };
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="mb-2">
        <h1 className="text-[24px] font-bold text-text-primary">Settings</h1>
        <p className="text-[14px] text-text-secondary mt-1">Manage your store information, preferences, and system settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <SettingsCard 
            title="Store Information" 
            subtitle="Details visible to customers on receipts and tracking."
            icon={Store}
            actions={
              <button 
                onClick={() => {
                  if (editStore) handleSave();
                  setEditStore(!editStore);
                }}
                className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition-colors ${editStore ? 'bg-success-green text-white hover:bg-green-600' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
              >
                {editStore ? (saving ? 'Saving...' : 'Save Details') : 'Edit Details'}
              </button>
            }
          >
            <FormField label="Store Name" value={settings.storeInfo.storeName} readOnly={!editStore} onChange={v => update('storeInfo', 'storeName', v)} />
            <FormField label="Founder / Owner Name" value={settings.storeInfo.founder} readOnly={!editStore} onChange={v => update('storeInfo', 'founder', v)} />
            <FormField label="Address" value={settings.storeInfo.address} readOnly={!editStore} onChange={v => update('storeInfo', 'address', v)} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Phone Number" value={settings.storeInfo.phone} readOnly={!editStore} onChange={v => update('storeInfo', 'phone', v)} />
              <FormField label="Email" value={settings.storeInfo.email} readOnly={!editStore} onChange={v => update('storeInfo', 'email', v)} />
            </div>
          </SettingsCard>

          <SettingsCard 
            title="Business Hours" 
            subtitle="Configure when your store accepts new orders."
            icon={Clock}
            actions={
              <button 
                onClick={() => {
                  if (editHours) handleSave();
                  setEditHours(!editHours);
                }}
                className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition-colors ${editHours ? 'bg-success-green text-white hover:bg-green-600' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
              >
                {editHours ? (saving ? 'Saving...' : 'Save Hours') : 'Edit Hours'}
              </button>
            }
          >
            <div className="flex flex-col gap-3">
              {settings.businessHours.map((bh, i) => (
                <div key={bh.day} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="w-16 font-medium text-text-primary text-[14px]">{bh.day}</div>
                  
                  {editHours ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input 
                        type="time" 
                        value={bh.open}
                        onChange={(e) => {
                          const newHours = [...settings.businessHours];
                          newHours[i].open = e.target.value;
                          setSettings({...settings, businessHours: newHours});
                        }}
                        className="px-2 py-1 rounded border border-gray-300 text-[13px] outline-none focus:border-primary-blue"
                      />
                      <span className="text-text-secondary text-[13px]">to</span>
                      <input 
                        type="time" 
                        value={bh.close}
                        onChange={(e) => {
                          const newHours = [...settings.businessHours];
                          newHours[i].close = e.target.value;
                          setSettings({...settings, businessHours: newHours});
                        }}
                        className="px-2 py-1 rounded border border-gray-300 text-[13px] outline-none focus:border-primary-blue"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 text-text-secondary text-[14px]">{bh.open} - {bh.close}</div>
                  )}

                  <ToggleRow label="" checked={bh.enabled} onChange={(val) => {
                    const newHours = [...settings.businessHours];
                    newHours[i].enabled = val;
                    setSettings({...settings, businessHours: newHours});
                  }} />
                </div>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard 
            title="System Preferences" 
            subtitle="Localization and formatting options."
            icon={Sliders}
            actions={
              <button 
                onClick={() => {
                  if (editPrefs) handleSave();
                  setEditPrefs(!editPrefs);
                }}
                className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition-colors ${editPrefs ? 'bg-success-green text-white hover:bg-green-600' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
              >
                {editPrefs ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Preferences'}
              </button>
            }
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-text-secondary">Language</label>
                <select 
                  className={`px-4 py-2.5 rounded-lg border text-[14px] font-medium outline-none transition-colors ${!editPrefs ? 'bg-bg-app border-border text-text-secondary appearance-none cursor-default' : 'bg-white border-gray-300 text-text-primary focus:border-primary-blue'}`}
                  value={settings.preferences.language}
                  disabled={!editPrefs}
                  onChange={e => update('preferences', 'language', e.target.value)}
                >
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-text-secondary">Currency</label>
                <select 
                  className={`px-4 py-2.5 rounded-lg border text-[14px] font-medium outline-none transition-colors ${!editPrefs ? 'bg-bg-app border-border text-text-secondary appearance-none cursor-default' : 'bg-white border-gray-300 text-text-primary focus:border-primary-blue'}`}
                  value={settings.preferences.currency}
                  disabled={!editPrefs}
                  onChange={e => update('preferences', 'currency', e.target.value)}
                >
                  <option>INR</option>
                  <option>USD</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-text-secondary">Date Format</label>
                <input 
                  type="text"
                  placeholder="DD/MM/YYYY"
                  maxLength={10}
                  readOnly={!editPrefs}
                  className={`px-4 py-2.5 rounded-lg border text-[14px] font-medium outline-none transition-colors ${!editPrefs ? 'bg-bg-app border-border text-text-secondary' : 'bg-white border-gray-300 text-text-primary focus:border-primary-blue focus:ring-1 focus:ring-primary-blue'}`}
                  value={settings.preferences.dateFormat}
                  onChange={e => {
                    const digits = e.target.value.replace(/\D/g, '');
                    let formatted = digits;
                    if (digits.length > 2) {
                      formatted = digits.slice(0, 2) + '/' + digits.slice(2);
                    }
                    if (digits.length > 4) {
                      formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4, 8);
                    }
                    update('preferences', 'dateFormat', formatted);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-text-secondary">Time Format</label>
                <select 
                  className={`px-4 py-2.5 rounded-lg border text-[14px] font-medium outline-none transition-colors ${!editPrefs ? 'bg-bg-app border-border text-text-secondary appearance-none cursor-default' : 'bg-white border-gray-300 text-text-primary focus:border-primary-blue'}`}
                  value={settings.preferences.timeFormat}
                  disabled={!editPrefs}
                  onChange={e => update('preferences', 'timeFormat', e.target.value)}
                >
                  <option>12 Hour</option>
                  <option>24 Hour</option>
                </select>
              </div>
            </div>
          </SettingsCard>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <SettingsCard 
            title="Account Settings" 
            subtitle="Your personal login and contact details."
            icon={User}
            actions={
              <button 
                onClick={() => {
                  if (editAccount) handleSave();
                  setEditAccount(!editAccount);
                }}
                className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition-colors ${editAccount ? 'bg-success-green text-white hover:bg-green-600' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
              >
                {editAccount ? (saving ? 'Saving...' : 'Save Profile') : 'Edit Profile'}
              </button>
            }
          >
            <FormField label="Full Name" value={settings.account.name} readOnly={!editAccount} onChange={v => update('account', 'name', v)} />
            <FormField label="Email Address" value={settings.account.email} readOnly={!editAccount} onChange={v => update('account', 'email', v)} />
            <FormField label="Phone Number" value={settings.account.phone} readOnly={!editAccount} onChange={v => update('account', 'phone', v)} />
          </SettingsCard>

          <SettingsCard 
            title="Notifications" 
            subtitle="Control which alerts you receive."
            icon={Bell}
            actions={
              <button 
                onClick={() => {
                  if (editNotifs) handleSave();
                  setEditNotifs(!editNotifs);
                }}
                className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition-colors ${editNotifs ? 'bg-success-green text-white hover:bg-green-600' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
              >
                {editNotifs ? (saving ? 'Saving...' : 'Save Alerts') : 'Edit Alerts'}
              </button>
            }
          >
            <div className={`transition-opacity ${!editNotifs ? 'opacity-70 pointer-events-none' : ''}`}>
              <CheckboxRow label="New Order Notifications" checked={settings.notifications.newOrder} onChange={v => update('notifications', 'newOrder', v)} />
              <CheckboxRow label="Order Status Updates" checked={settings.notifications.orderStatusUpdates} onChange={v => update('notifications', 'orderStatusUpdates', v)} />
              <CheckboxRow label="Low Stock Alerts" checked={settings.notifications.lowStockAlerts} onChange={v => update('notifications', 'lowStockAlerts', v)} />
              <CheckboxRow label="Daily Sales Summary" checked={settings.notifications.dailySalesSummary} onChange={v => update('notifications', 'dailySalesSummary', v)} />
              <CheckboxRow label="System Notifications" checked={settings.notifications.systemNotifications} onChange={v => update('notifications', 'systemNotifications', v)} />
            </div>
          </SettingsCard>

          <SettingsCard 
            title="Payment Settings" 
            subtitle="Enabled payment methods for your store."
            icon={CreditCard}
            actions={
              <button 
                onClick={() => {
                  if (editPayment) handleSave();
                  setEditPayment(!editPayment);
                }}
                className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition-colors ${editPayment ? 'bg-success-green text-white hover:bg-green-600' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
              >
                {editPayment ? (saving ? 'Saving...' : 'Save Payments') : 'Edit Payments'}
              </button>
            }
          >
            <div className="mb-4">
              <p className="text-[13px] font-medium text-success-green bg-success-green/10 px-3 py-2 rounded border border-success-green/20">
                All transactions are secure and encrypted.
              </p>
            </div>
            <div className={`flex flex-col gap-2 transition-opacity ${!editPayment ? 'opacity-70 pointer-events-none' : ''}`}>
              <ToggleRow label="UPI (Google Pay, PhonePe, Paytm)" checked={settings.payment.upi} onChange={v => update('payment', 'upi', v)} />
              <div className="h-px bg-border my-1"></div>
              <ToggleRow label="Credit / Debit Card" checked={settings.payment.card} onChange={v => update('payment', 'card', v)} />
              <div className="h-px bg-border my-1"></div>
              <ToggleRow label="Cash on Delivery" checked={settings.payment.cod} onChange={v => update('payment', 'cod', v)} />
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
