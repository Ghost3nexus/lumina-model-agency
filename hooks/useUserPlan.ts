/**
 * useUserPlan — Fetches user's plan, credits, and contracted models from Supabase
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface UserPlan {
  plan: 'free' | 'starter' | 'pro' | 'business';
  creditsRemaining: number;
  creditsMonthly: number;
  contractedModels: string[]; // model IDs
}

const DEFAULT_PLAN: UserPlan = {
  plan: 'free',
  creditsRemaining: 5,
  creditsMonthly: 5,
  contractedModels: [],
};

export function useUserPlan() {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<UserPlan>(DEFAULT_PLAN);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserPlan(DEFAULT_PLAN);
      setLoading(false);
      return;
    }

    async function fetchPlan() {
      setLoading(true);

      // Fetch credits
      const { data: credits } = await supabase
        .from('user_credits')
        .select('plan, credits_remaining, credits_monthly')
        .eq('user_id', user!.id)
        .single();

      // Fetch contracted models
      const { data: contracts } = await supabase
        .from('model_contracts')
        .select('model_id')
        .eq('user_id', user!.id)
        .gte('expires_at', new Date().toISOString());

      setUserPlan({
        plan: (credits?.plan as UserPlan['plan']) ?? 'free',
        creditsRemaining: credits?.credits_remaining ?? 5,
        creditsMonthly: credits?.credits_monthly ?? 5,
        contractedModels: contracts?.map(c => c.model_id) ?? [],
      });

      setLoading(false);
    }

    fetchPlan();
  }, [user]);

  /** Check if a model is available for the current user */
  function isModelAvailable(modelId: string): boolean {
    if (userPlan.plan === 'free') return true; // Free = all models open
    return userPlan.contractedModels.includes(modelId);
  }

  return { userPlan, loading, isModelAvailable };
}
