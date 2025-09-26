import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database service class for CBT Practice Platform
export class DatabaseService {
  constructor() {
    this.supabase = supabase
  }

  // User Management
  async createUser(userData) {
    const { data, error } = await this.supabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        department: userData.department,
        total_xp: userData.totalXP || 0,
        level: userData.level || 1,
        study_streak: userData.studyStreak || 0,
        longest_streak: userData.longestStreak || 0,
        last_study_date: userData.lastStudyDate,
        total_quizzes_taken: userData.totalQuizzesTaken || 0,
        perfect_scores: userData.perfectScores || 0,
        average_score: userData.averageScore || 0
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUser(email) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async updateUser(email, updates) {
    const { data, error } = await this.supabase
      .from('users')
      .update({
        ...updates,
        last_visit: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateStudyStreak(email, streakData) {
    const { data, error } = await this.supabase
      .from('users')
      .update({
        study_streak: streakData.studyStreak,
        longest_streak: streakData.longestStreak,
        last_study_date: streakData.lastStudyDate,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Quiz Results Management
  async saveQuizResult(userId, quizData) {
    const { data, error } = await this.supabase
      .from('quiz_results')
      .insert([{
        user_id: userId,
        course_code: quizData.courseCode,
        segment_number: quizData.segmentNumber,
        score: quizData.score,
        total_questions: quizData.totalQuestions,
        percentage: quizData.percentage,
        time_spent: quizData.timeSpent,
        marked_questions: quizData.markedQuestions || 0
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserQuizResults(userId, courseCode = null) {
    let query = this.supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (courseCode) {
      query = query.eq('course_code', courseCode)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Achievements Management
  async unlockAchievement(userId, achievementId) {
    const { data, error } = await this.supabase
      .from('user_achievements')
      .insert([{
        user_id: userId,
        achievement_id: achievementId
      }])
      .select()
      .single()

    if (error && error.code !== '23505') throw error // Ignore duplicate key errors
    return data
  }

  async getUserAchievements(userId) {
    const { data, error } = await this.supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Weak Areas Management
  async updateWeakArea(userId, courseCode, questionData) {
    const { data, error } = await this.supabase
      .from('weak_areas')
      .upsert({
        user_id: userId,
        course_code: courseCode,
        question_hash: questionData.questionHash,
        question_text: questionData.question,
        correct_answer: questionData.correctAnswer,
        wrong_count: questionData.wrongCount || 1,
        last_wrong: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,course_code,question_hash',
        ignoreDuplicates: false
      })
      .select()

    if (error) throw error
    return data
  }

  async getUserWeakAreas(userId, courseCode = null, limit = 10) {
    let query = this.supabase
      .from('weak_areas')
      .select('*')
      .eq('user_id', userId)
      .order('wrong_count', { ascending: false })
      .limit(limit)

    if (courseCode) {
      query = query.eq('course_code', courseCode)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Course Progress Management
  async updateCourseProgress(userId, courseCode, segmentNumber, scoreData) {
    const { data, error } = await this.supabase
      .from('course_progress')
      .upsert({
        user_id: userId,
        course_code: courseCode,
        segment_number: segmentNumber,
        attempts: scoreData.attempts,
        best_score: scoreData.bestScore,
        average_score: scoreData.averageScore,
        last_attempt: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,course_code,segment_number',
        ignoreDuplicates: false
      })
      .select()

    if (error) throw error
    return data
  }

  async getUserCourseProgress(userId) {
    const { data, error } = await this.supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_attempt', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Activity Logging
  async logActivity(userId, action, page, details = null) {
    const { data, error } = await this.supabase
      .from('activity_logs')
      .insert([{
        user_id: userId,
        action: action,
        page: page,
        details: details
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserActivity(userId, limit = 50) {
    const { data, error } = await this.supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  // Admin Analytics
  async getAllUsers() {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getAllQuizResults() {
    const { data, error } = await this.supabase
      .from('quiz_results')
      .select(`
        *,
        users (name, department)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getPlatformStats() {
    const [usersResult, quizResultsResult] = await Promise.all([
      this.supabase.from('users').select('id, created_at, last_visit, department'),
      this.supabase.from('quiz_results').select('percentage, created_at')
    ])

    if (usersResult.error) throw usersResult.error
    if (quizResultsResult.error) throw quizResultsResult.error

    const users = usersResult.data || []
    const quizResults = quizResultsResult.data || []

    const today = new Date().toDateString()
    const activeToday = users.filter(user => 
      user.last_visit && new Date(user.last_visit).toDateString() === today
    ).length

    const averageScore = quizResults.length > 0 ? 
      Math.round(quizResults.reduce((sum, quiz) => sum + quiz.percentage, 0) / quizResults.length) : 0

    return {
      totalUsers: users.length,
      totalQuizzes: quizResults.length,
      activeToday: activeToday,
      averageScore: averageScore,
      users: users,
      quizResults: quizResults
    }
  }

  // Data Migration (for existing localStorage users)
  async migrateLocalStorageData(localData) {
    const results = []
    
    for (const [userId, userData] of Object.entries(localData.users || {})) {
      try {
        // Create user
        const user = await this.createUser({
          name: userData.name,
          email: `${userId}@local.migration`, // Temporary email for migration
          department: userData.department,
          totalXP: userData.totalXP,
          level: userData.level,
          studyStreak: userData.studyStreak,
          longestStreak: userData.longestStreak,
          lastStudyDate: userData.lastStudyDate,
          totalQuizzesTaken: userData.totalQuizzesTaken,
          perfectScores: userData.perfectScores,
          averageScore: userData.averageScore
        })

        // Migrate quiz history
        if (userData.quizHistory) {
          for (const quiz of userData.quizHistory) {
            await this.saveQuizResult(user.id, {
              courseCode: quiz.courseCode,
              segmentNumber: quiz.segmentNumber,
              score: quiz.score,
              totalQuestions: quiz.totalQuestions,
              percentage: quiz.percentage,
              timeSpent: quiz.timeSpent,
              markedQuestions: quiz.markedQuestions || 0
            })
          }
        }

        // Migrate achievements
        if (userData.achievements) {
          for (const achievementId of userData.achievements) {
            await this.unlockAchievement(user.id, achievementId)
          }
        }

        // Migrate weak areas
        if (userData.weakAreas) {
          for (const [courseCode, weakQuestions] of Object.entries(userData.weakAreas)) {
            for (const [questionHash, weakData] of Object.entries(weakQuestions)) {
              await this.updateWeakArea(user.id, courseCode, {
                questionHash: questionHash,
                question: weakData.question,
                correctAnswer: weakData.correctAnswer,
                wrongCount: weakData.wrongCount
              })
            }
          }
        }

        results.push({ success: true, userId: userId, dbUserId: user.id })
      } catch (error) {
        results.push({ success: false, userId: userId, error: error.message })
      }
    }

    return results
  }
}