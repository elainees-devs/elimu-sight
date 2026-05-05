-- =========================
-- SCHOOL TABLE
-- =========================
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    subscription_plan VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_schools_email ON schools(email);


-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('ADMIN','TEACHER','HEADTEACHER','ACCOUNTANT')),
    assigned_class_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_email ON users(email);


-- =========================
-- CLASSES TABLE
-- =========================
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100),
    level VARCHAR(50),
    stream VARCHAR(50),
    academic_year VARCHAR(20),
    class_teacher_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_classes_school_id ON classes(school_id);


-- =========================
-- STUDENTS TABLE
-- =========================
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    admission_number VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10),
    date_of_birth DATE,
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_class_id ON students(class_id);


-- =========================
-- SUBJECTS TABLE
-- =========================
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subjects_school_id ON subjects(school_id);


-- =========================
-- CLASS_SUBJECTS (MANY TO MANY)
-- =========================
CREATE TABLE class_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_class_subject_class_id ON class_subjects(class_id);
CREATE INDEX idx_class_subject_subject_id ON class_subjects(subject_id);


-- =========================
-- ASSESSMENTS TABLE
-- =========================
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),

    term VARCHAR(50),
    exam_type VARCHAR(50) CHECK (exam_type IN ('QUIZ','CAT','EXAM','ASSIGNMENT')),

    score DECIMAL(5,2),
    total_marks DECIMAL(5,2),

    grade VARCHAR(5),
    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assessments_student_id ON assessments(student_id);
CREATE INDEX idx_assessments_subject_id ON assessments(subject_id);
CREATE INDEX idx_assessments_class_id ON assessments(class_id);


-- =========================
-- INSIGHTS TABLE
-- =========================
CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id),
    student_id UUID REFERENCES students(id),
    subject_id UUID REFERENCES subjects(id),

    type VARCHAR(50) CHECK (
        type IN (
            'STUDENT_PERFORMANCE',
            'CLASS_PERFORMANCE',
            'SUBJECT_TREND',
            'TERM_ANALYSIS',
            'PREDICTION',
            'RECOMMENDATION'
        )
    ),

    title VARCHAR(255),
    summary TEXT,
    data JSONB,

    confidence_score DECIMAL(5,2),
    generated_by VARCHAR(20) CHECK (generated_by IN ('SYSTEM','AI','USER')),
    period VARCHAR(50),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_insights_school_id ON insights(school_id);
CREATE INDEX idx_insights_student_id ON insights(student_id);
CREATE INDEX idx_insights_class_id ON insights(class_id);
CREATE INDEX idx_insights_subject_id ON insights(subject_id);


-- =========================
-- OPTIONAL: AI LOGS TABLE (VERY USEFUL)
-- =========================
CREATE TABLE ai_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    input_data JSONB,
    output_data JSONB,
    model_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_school_id ON ai_logs(school_id);