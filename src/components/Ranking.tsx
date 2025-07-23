import React, { useState, useEffect } from 'react'
import { Trophy, Medal, Award, User, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { StudentWithTotalScore } from '../lib/supabase'
import './Ranking.css'

const Ranking: React.FC = () => {
  const [students, setStudents] = useState<StudentWithTotalScore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStudentRankings()
  }, [])

  const fetchStudentRankings = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          name,
          scores (
            score,
            date
          )
        `)
        .order('name')

      if (error) throw error

      // 处理数据，计算每个学生的总成绩
      const studentsWithScores: StudentWithTotalScore[] = data.map((student: any) => {
        const scores = student.scores || []
        const totalScore = scores.reduce((sum: number, score: any) => sum + score.score, 0)
        const latestDate = scores.length > 0 
          ? scores.reduce((latest: any, current: any) => 
              new Date(current.date) > new Date(latest.date) ? current : latest
            ).date
          : null

        return {
          id: student.id,
          name: student.name,
          total_score: totalScore,
          score_count: scores.length,
          latest_date: latestDate
        }
      })

      // 按总成绩排序（从高到低），没有成绩的排在最后
      const sortedStudents = studentsWithScores.sort((a, b) => {
        if (a.total_score === 0 && b.total_score === 0) return 0
        if (a.total_score === 0) return 1
        if (b.total_score === 0) return -1
        return b.total_score - a.total_score
      })

      setStudents(sortedStudents)
    } catch (err) {
      setError('获取排名数据失败')
      console.error('Error fetching rankings:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="rank-icon gold" />
      case 1:
        return <Medal className="rank-icon silver" />
      case 2:
        return <Award className="rank-icon bronze" />
      default:
        return <span className="rank-number">{index + 1}</span>
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '暂无记录'
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  if (loading) {
    return (
      <div className="ranking-container">
        <div className="loading">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ranking-container">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <h1>学生成绩排名</h1>
        <p>根据总成绩排序</p>
      </div>

      {students.length === 0 ? (
        <div className="empty-state">
          <User className="empty-icon" />
          <p>暂无学生数据</p>
        </div>
      ) : (
        <div className="ranking-list">
          {students.map((student, index) => (
            <div key={student.id} className={`ranking-item ${index < 3 ? 'top-three' : ''}`}>
              <div className="rank-info">
                {getRankIcon(index)}
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <div className="score-info">
                    {student.total_score > 0 ? (
                      <>
                        <span className="score">{student.total_score} 分 (总分)</span>
                        <span className="score-count">共 {student.score_count} 次记录</span>
                        <span className="date">
                          <Calendar className="date-icon" />
                          最近更新: {formatDate(student.latest_date)}
                        </span>
                      </>
                    ) : (
                      <span className="no-score">暂无成绩</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Ranking
