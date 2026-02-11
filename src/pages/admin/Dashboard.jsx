
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Plus,
  Video,
  BarChart2,
  BookOpen,
  GraduationCap
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const adminModules = [
    {
      title: "News & Articles",
      icon: FileText,
      description: "Manage news posts, articles, and content.",
      action: "Manage News",
      link: "/news", // Redirect to news page where admin controls are visible, or create a specific list page
      subActions: [
        { label: "Create New", link: "/admin/news/create" }
      ]
    },
    {
      title: "Teachers & Mentors",
      icon: GraduationCap,
      description: "Manage profiles of teachers and mentors.",
      action: "Manage Teachers",
      link: "/admin/teachers",
      subActions: []
    },
    {
      title: "Editorial Team",
      icon: Users,
      description: "Manage editorial team members.",
      action: "Manage Team",
      link: "/admin/editorial-team",
      subActions: []
    },
    {
      title: "Zoom Links",
      icon: Video,
      description: "Update Zoom links for mentoring services.",
      action: "Manage Links",
      link: "/admin/zoom-links",
      subActions: []
    },
    {
      title: "Analytics",
      icon: BarChart2,
      description: "View site traffic and visitor statistics.",
      action: "View Analytics",
      link: "/admin/analytics",
      subActions: []
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-sky-600 text-white p-2 rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl text-slate-800">Admin Console</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user?.email}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
          <p className="text-slate-600">Welcome back! Manage your website content and settings here.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-slate-800">
                  {module.title}
                </CardTitle>
                <module.icon className="w-5 h-5 text-sky-600" />
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-6 h-10">
                  {module.description}
                </p>
                
                <div className="space-y-3">
                  <Link to={module.link}>
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white"> {/* Changed text color to white */}
                      {module.action}
                    </Button>
                  </Link>
                  
                  {module.subActions.map((sub, sIdx) => (
                    <Link key={sIdx} to={sub.link}>
                      <Button variant="outline" className="w-full border-dashed text-slate-800">
                        <Plus className="w-3 h-3 mr-2" /> {sub.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
