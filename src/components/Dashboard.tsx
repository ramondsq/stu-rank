import React, { useState, useEffect } from 'react'
import { LogOut, UserPlus, FileText, Edit3, Plus, Save, X, Home, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import type { Student, Score } from '../lib/supabase'
import './Dashboard.css'

const Dashboard: React.FC = () => {
  const { signOut } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [newStudentName, setNewStudentName] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const [newScore, setNewScore] = useState('')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [editingScore, setEditingScore] = useState<number | null>(null)
  const [editScore, setEditScore] = useState('')
  const [editDate, setEditDate] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // 获取学生列表
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('name')

      if (studentsError) throw studentsError

      // 获取成绩记录
      const { data: scoresData, error: scoresError } = await supabase
        .from('scores')
        .select(`
          *,
          student:students(*)
        `)
        .order('created_at', { ascending: false })

      if (scoresError) throw scoresError

      setStudents(studentsData || [])
      setScores(scoresData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStudentName.trim()) return

    try {
      const { error } = await supabase
        .from('students')
        .insert([{ name: newStudentName.trim() }])

      if (error) throw error

      setNewStudentName('')
      fetchData()
    } catch (error) {
      console.error('Error adding student:', error)
    }
  }

  const addScore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent || !newScore) return

    try {
      const { error } = await supabase
        .from('scores')
        .insert([{
          student_id: selectedStudent,
          score: parseFloat(newScore),
          date: newDate
        }])

      if (error) throw error

      setNewScore('')
      setSelectedStudent(null)
      fetchData()
    } catch (error) {
      console.error('Error adding score:', error)
    }
  }

  const startEditScore = (score: Score) => {
    setEditingScore(score.id)
    setEditScore(score.score.toString())
    setEditDate(score.date)
  }

  const saveEditScore = async () => {
    if (!editingScore || !editScore) return

    try {
      const { error } = await supabase
        .from('scores')
        .update({
          score: parseFloat(editScore),
          date: editDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingScore)

      if (error) throw error

      setEditingScore(null)
      setEditScore('')
      setEditDate('')
      fetchData()
    } catch (error) {
      console.error('Error updating score:', error)
    }
  }

  const cancelEdit = () => {
    setEditingScore(null)
    setEditScore('')
    setEditDate('')
  }

  const deleteStudent = async (studentId: number) => {
    if (!confirm('确定要删除这个学生吗？删除后相关的成绩记录也会被删除。')) {
      return
    }

    try {
      // 先删除该学生的所有成绩记录
      const { error: scoresError } = await supabase
        .from('scores')
        .delete()
        .eq('student_id', studentId)

      if (scoresError) throw scoresError

      // 再删除学生记录
      const { error: studentError } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId)

      if (studentError) throw studentError

      fetchData()
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('删除学生失败，请重试')
    }
  }

  const deleteScore = async (scoreId: number) => {
    if (!confirm('确定要删除这条成绩记录吗？')) {
      return
    }

    try {
      const { error } = await supabase
        .from('scores')
        .delete()
        .eq('id', scoreId)

      if (error) throw error

      fetchData()
    } catch (error) {
      console.error('Error deleting score:', error)
      alert('删除成绩记录失败，请重试')
    }
  }

  if (loading) {
    return <div className="dashboard-loading">加载中...</div>
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <a href="/" className="back-home-button">
            <Home className="button-icon" />
            返回主页
          </a>
        </div>
        <h1>教师管理面板</h1>
        <button onClick={signOut} className="logout-button">
          <LogOut className="button-icon" />
          退出登录
        </button>
      </header>

      <div className="dashboard-content">
        {/* 添加学生 */}
        <div className="section">
          <h2>
            <UserPlus className="section-icon" />
            添加学生
          </h2>
          <form onSubmit={addStudent} className="add-student-form">
            <input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="输入学生姓名"
              required
            />
            <button type="submit">
              <Plus className="button-icon" />
              添加
            </button>
          </form>
        </div>

        {/* 添加成绩 */}
        <div className="section">
          <h2>
            <FileText className="section-icon" />
            添加成绩
          </h2>
          <form onSubmit={addScore} className="add-score-form">
            <select
              value={selectedStudent || ''}
              onChange={(e) => setSelectedStudent(Number(e.target.value) || null)}
              required
            >
              <option value="">选择学生</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              placeholder="分数"
              min="0"
              max="100"
              step="0.1"
              required
            />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
            />
            <button type="submit">
              <Plus className="button-icon" />
              添加成绩
            </button>
          </form>
        </div>

        {/* 学生管理 */}
        <div className="section">
          <h2>
            <UserPlus className="section-icon" />
            学生管理
          </h2>
          <div className="students-list">
            {students.length === 0 ? (
              <p className="empty-message">暂无学生</p>
            ) : (
              students.map((student) => (
                <div key={student.id} className="student-item">
                  <div className="student-info">
                    <strong>{student.name}</strong>
                    <span className="student-date">
                      添加时间: {new Date(student.created_at).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteStudent(student.id)}
                    className="delete-button"
                    title="删除学生"
                  >
                    <Trash2 className="button-icon" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 成绩记录 */}
        <div className="section">
          <h2>
            <Edit3 className="section-icon" />
            成绩记录
          </h2>
          <div className="scores-list">
            {scores.length === 0 ? (
              <p className="empty-message">暂无成绩记录</p>
            ) : (
              scores.map((score) => (
                <div key={score.id} className="score-item">
                  <div className="score-info">
                    <strong>{score.student.name}</strong>
                    {editingScore === score.id ? (
                      <div className="edit-form">
                        <input
                          type="number"
                          value={editScore}
                          onChange={(e) => setEditScore(e.target.value)}
                          min="0"
                          max="100"
                          step="0.1"
                        />
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                        />
                        <div className="edit-actions">
                          <button onClick={saveEditScore} className="save-button">
                            <Save className="button-icon" />
                          </button>
                          <button onClick={cancelEdit} className="cancel-button">
                            <X className="button-icon" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="score-details">
                        <span className="score">{score.score} 分</span>
                        <span className="date">{new Date(score.date).toLocaleDateString('zh-CN')}</span>
                        <div className="score-actions">
                          <button
                            onClick={() => startEditScore(score)}
                            className="edit-button"
                            title="编辑成绩"
                          >
                            <Edit3 className="button-icon" />
                          </button>
                          <button
                            onClick={() => deleteScore(score.id)}
                            className="delete-button"
                            title="删除成绩"
                          >
                            <Trash2 className="button-icon" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
