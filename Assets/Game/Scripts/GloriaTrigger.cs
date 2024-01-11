using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GloriaTrigger : MonoBehaviour
{

    public GameObject Gloria;

    public void PrintEvent(string s)
    {
        Debug.Log("PrintEvent: " + s + " called at: " + Time.time);
    }

    public void ChangeColor()
    {
        SpriteRenderer sprite = Gloria.GetComponent<SpriteRenderer>();
        sprite.color = new Color (1, 0, 0, 1);
    }

    public void SetIdle()
    {
        Animator m_Animator = Gloria.GetComponent<Animator>();
        m_Animator.SetTrigger("GoToIdle");
    }

    public void SetFlagStop()
    {
        Animator m_Animator = Gloria.GetComponent<Animator>();
        m_Animator.SetTrigger("GoToFlagStop");
    }

    public void SetFlagWalk()
    {
        Animator m_Animator = Gloria.GetComponent<Animator>();
        m_Animator.SetTrigger("GoToFlagWalk");
    }
}
