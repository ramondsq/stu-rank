-- 学生成绩排名系统数据库初始化脚本
-- 在 Supabase SQL 编辑器中运行此脚本

-- 1. 创建学生表
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建成绩表
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. 为成绩表添加更新时间戳触发器
DROP TRIGGER IF EXISTS update_scores_updated_at ON scores;
CREATE TRIGGER update_scores_updated_at
    BEFORE UPDATE ON scores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_scores_student_id ON scores(student_id);
CREATE INDEX IF NOT EXISTS idx_scores_date ON scores(date);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);

-- 6. 启用行级安全性 (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- 7. 创建 RLS 策略
-- 允许所有人查看学生信息（用于排名显示）
CREATE POLICY "Allow public read access to students" ON students
    FOR SELECT USING (true);

-- 允许所有人查看成绩信息（用于排名显示）
CREATE POLICY "Allow public read access to scores" ON scores
    FOR SELECT USING (true);

-- 只允许认证用户添加学生
CREATE POLICY "Allow authenticated users to insert students" ON students
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 只允许认证用户更新学生信息
CREATE POLICY "Allow authenticated users to update students" ON students
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 只允许认证用户删除学生
CREATE POLICY "Allow authenticated users to delete students" ON students
    FOR DELETE USING (auth.role() = 'authenticated');

-- 只允许认证用户添加成绩
CREATE POLICY "Allow authenticated users to insert scores" ON scores
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 只允许认证用户更新成绩
CREATE POLICY "Allow authenticated users to update scores" ON scores
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 只允许认证用户删除成绩
CREATE POLICY "Allow authenticated users to delete scores" ON scores
    FOR DELETE USING (auth.role() = 'authenticated');

-- 8. 插入示例数据（可选）
INSERT INTO students (name) VALUES 
    ('张三'),
    ('李四'),
    ('王五'),
    ('赵六'),
    ('陈七')
ON CONFLICT DO NOTHING;

-- 插入示例成绩
INSERT INTO scores (student_id, score, date) VALUES 
    (1, 85.5, '2024-01-15'),
    (2, 92.0, '2024-01-15'),
    (3, 78.5, '2024-01-15'),
    (4, 88.0, '2024-01-15'),
    (5, 95.5, '2024-01-15'),
    (1, 87.0, '2024-01-20'),
    (2, 89.5, '2024-01-20'),
    (3, 82.0, '2024-01-20')
ON CONFLICT DO NOTHING;
