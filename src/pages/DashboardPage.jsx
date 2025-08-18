import { useAuth } from '../contexts/AuthContext'
import { useProjects } from '../contexts/ProjectContext'
import { FaProjectDiagram, FaDollarSign, FaClock, FaCheckCircle } from 'react-icons/fa'

const DashboardPage = () => {
  const { currentUser } = useAuth()
  const { projects } = useProjects()

  const userProjects = projects.filter(project => project.userId === currentUser?.id)
  const activeProjects = userProjects.filter(project => project.status === 'active')
  const completedProjects = userProjects.filter(project => project.status === 'completed')

  const stats = [
    {
      name: 'Total Projects',
      value: userProjects.length,
      icon: FaProjectDiagram,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Projects',
      value: activeProjects.length,
      icon: FaClock,
      color: 'bg-yellow-500'
    },
    {
      name: 'Completed Projects',
      value: completedProjects.length,
      icon: FaCheckCircle,
      color: 'bg-green-500'
    },
    {
      name: 'Total Earnings',
      value: `$${userProjects.reduce((sum, project) => sum + (project.budget || 0), 0).toLocaleString()}`,
      icon: FaDollarSign,
      color: 'bg-purple-500'
    }
  ]

  const recentProjects = userProjects.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.name}!</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`inline-flex items-center justify-center p-3 rounded-md ${stat.color} text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Projects</h3>
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{project.title}</h4>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${project.budget}</p>
                      <span className={`status-badge ${
                        project.status === 'active' ? 'status-active' :
                        project.status === 'completed' ? 'status-completed' :
                        'status-pending'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No projects yet. Create your first project!</p>
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-primary">
                Create New Project
              </button>
              <button className="w-full btn-secondary">
                Browse Projects
              </button>
              <button className="w-full btn-secondary">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
