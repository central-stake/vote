'use server'

import app, { db } from './config';
import { addDoc, collection, query, doc, where, getDoc, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { getAuth, signInAnonymously } from "firebase/auth";
import { VotesSubmit } from '@/lib/vote-submit';
import { convertVoteResponseToVoteState } from '@/lib/utils';

export type CallResponseError = {
  message: string,
};

export type CallResponse = {
  result?: any,
  error?: CallResponseError | null | undefined,
};

const createVote = async (voteData: VotesSubmit): Promise<CallResponse> => {
  const auth = getAuth(app);
  try {
    await signInAnonymously(auth);
    const collectionRef = collection(db, 'votes');
    await addDoc(collectionRef, voteData);
    return {
      result: 'ok',
    }
  } catch(error) {
    const errorMessage = 'Error happen while saving the vote, please try again.';
    console.log(errorMessage);
    console.error('Error : ', error);

    return {
      error: {
        message: errorMessage,
      }
    }
  }
}

const getVoteById = async (voteId: string): Promise<CallResponse> => {
  const auth = getAuth(app);
  try {
    await signInAnonymously(auth);
    const collectionRef = collection(db, 'votes');
    const q = query(collectionRef, where('id', '==', voteId));
    const votesCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(q);

    if (votesCollectionSnapshot.size > 0) {
      const data = votesCollectionSnapshot.docs[0].data();

      return {
        result: convertVoteResponseToVoteState(data.votes),
      }
    }

    return {
      error: {
        message: 'Not found.',
      }
    }
  } catch(error) {
    const errorMessage = 'Error happen while getting the vote, please try again.';
    console.log(errorMessage);
    console.error('Error : ', error);

    return {
      error: {
        message: errorMessage,
      }
    }
  }
}

export { createVote, getVoteById }