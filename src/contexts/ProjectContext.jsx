import { createContext, useContext, useState, useEffect } from 'react'

const ProjectContext = createContext()

export const useProjects = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider')
  }
  return context
}

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedProjects = localStorage.getItem('artcee_projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active'
    }
    const updatedProjects = [...projects, newProject]
    setProjects(updatedProjects)
    localStorage.setItem('artcee_projects', JSON.stringify(updatedProjects))
  }

  const updateProject = (projectId, updates) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    )
    setProjects(updatedProjects)
    localStorage.setItem('artcee_projects', JSON.stringify(updatedProjects))
  }

  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(project => project.id !== projectId)
    setProjects(updatedProjects)
    localStorage.setItem('artcee_projects', JSON.stringify(updatedProjects))
  }

  const getProjectById = (projectId) => {
    return projects.find(project => project.id === projectId)
  }

  const getUserProjects = (userId) => {
    return projects.filter(project => project.userId === userId)
  }

  const value = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getUserProjects,
    loading
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}
