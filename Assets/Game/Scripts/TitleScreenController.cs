using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TitleScreenController : MonoBehaviour
{

    public GameObject TitleScreen;

    public void ToAudioWarning()
    {
        Animator m_Animator = TitleScreen.GetComponent<Animator>();
        m_Animator.SetTrigger("ToAudioWarning");
    }

    public void FadeOut()
    {
        Animator m_Animator = TitleScreen.GetComponent<Animator>();
        m_Animator.SetTrigger("FadeOut");
    }

}