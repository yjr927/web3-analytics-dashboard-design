import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Mail, Briefcase, Calendar, Settings } from "lucide-react";

export function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-slate-900 mb-2">Profile</h1>
        <p className="text-slate-600">Manage your account settings and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 md:col-span-1">
          <div className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
              <AvatarFallback>PM</AvatarFallback>
            </Avatar>
            <h2 className="text-xl text-slate-900 mb-1">Product Manager</h2>
            <p className="text-sm text-slate-600 mb-4">pm@company.com</p>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </Card>

        {/* Details Card */}
        <Card className="p-6 md:col-span-2">
          <h3 className="text-lg text-slate-900 mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Mail className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="text-slate-900">pm@company.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm text-slate-500">Role</p>
                <p className="text-slate-900">Product Manager</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm text-slate-500">Member Since</p>
                <p className="text-slate-900">January 2025</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg text-slate-900">Preferences</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-slate-900">Email Notifications</p>
              <p className="text-sm text-slate-600">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-slate-900">Weekly Reports</p>
              <p className="text-sm text-slate-600">Get weekly analytics summary</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-slate-900">Alert Notifications</p>
              <p className="text-sm text-slate-600">Get notified about unusual activity</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
}
