import { useParams, useNavigate } from 'react-router-dom'
import { useProjects } from '../contexts/ProjectContext'
import { FaArrowLeft, FaEdit, FaTrash, FaCalendar, FaDollarSign, FaTag } from 'react-icons/fa'

const ProjectDetailPage = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { getProjectById, deleteProject } = useProjects()
  
  const project = getProjectById(projectId)

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
        <p className="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard/projects')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </button>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId)
      navigate('/dashboard/projects')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/dashboard/projects')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </button>
        
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/dashboard/projects/${projectId}/edit`)}
            className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaEdit className="mr-2 h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            <FaTrash className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
              </div>

              {project.requirements && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Requirements</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{project.requirements}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaTag className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Category</p>
                      <p className="text-sm text-gray-600">{project.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaDollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Budget</p>
                      <p className="text-sm text-gray-600">${project.budget?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaCalendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Deadline</p>
                      <p className="text-sm text-gray-600">
                        {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaCalendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Created</p>
                      <p className="text-sm text-gray-600">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Project Status</h3>
                <p className="text-sm text-blue-700">
                  This project is currently {project.status}. 
                  {project.status === 'active' && ' Work is in progress.'}
                  {project.status === 'completed' && ' All work has been completed.'}
                  {project.status === 'pending' && ' Waiting for approval to start.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage
