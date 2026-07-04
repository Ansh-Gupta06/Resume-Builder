import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { generateId } from '@/utils'
import type { Resume } from '@/types/resume'

function resumesCol(uid: string) {
  return collection(db, 'users', uid, 'resumes')
}

function resumeDoc(uid: string, resumeId: string) {
  return doc(db, 'users', uid, 'resumes', resumeId)
}

function fromFirestore(snap: QueryDocumentSnapshot): Resume {
  const data = snap.data()
  const toISO = (val: unknown): string => {
    if (val instanceof Timestamp) return val.toDate().toISOString()
    if (typeof val === 'string') return val
    return new Date().toISOString()
  }
  return {
    ...(data as Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>),
    id: snap.id,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  }
}

async function fetchResumes(uid: string): Promise<Resume[]> {
  const q = query(resumesCol(uid), orderBy('updatedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(fromFirestore)
}

async function createResume(uid: string, resume: Resume): Promise<Resume> {
  const ref = resumeDoc(uid, resume.id)
  await setDoc(ref, {
    ...resume,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return resume
}

async function updateResume(
  uid: string,
  resumeId: string,
  updates: Partial<Omit<Resume, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(resumeDoc(uid, resumeId), {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

async function deleteResume(uid: string, resumeId: string): Promise<void> {
  await deleteDoc(resumeDoc(uid, resumeId))
}

async function duplicateResume(uid: string, sourceId: string, source: Resume): Promise<Resume> {
  const now = new Date().toISOString()
  const copy: Resume = {
    ...(JSON.parse(JSON.stringify(source)) as Resume),
    id: generateId(),
    title: `${source.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
  }
  const ref = resumeDoc(uid, copy.id)
  await setDoc(ref, {
    ...copy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return copy
}

export const resumeService = {
  fetchResumes,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
}
