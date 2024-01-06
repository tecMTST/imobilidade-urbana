using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;


public class TimerUpdateText : MonoBehaviour
{
    public TMP_Text  timerObj;
    private GameObject timerController; 
    private float currentTime;
    private bool aviso1 = false;
    private bool aviso2 = false;
    private bool aviso3 = false;
    private bool aviso4 = false;
    private bool aviso5 = false;
    private bool aviso6 = false;

    // Start is called before the first frame update
    void Start()
    {
        timerController = GameObject.Find("TimerController");
    }

    // Update is called once per frame
    void Update()
    {
        currentTime = timerController.GetComponent<TimerController>().GetCurrentTime();
        int minutes = Mathf.FloorToInt(currentTime / 60);
        int seconds = Mathf.FloorToInt(currentTime % 60);
        string formattedTime = string.Format("{0:00}:{1:00}", minutes, seconds);
        timerObj.SetText(formattedTime);

        //Avisos Sonoros Timer:
        if (formattedTime == "09:59" && !aviso1)
        {
            SoundManager.instance.playTimerSFX((int)SoundManager.ListaSFX.sonoroTimer);
            aviso1 = true;
        }
        else if (formattedTime == "09:58" && !aviso2)
        {
            SoundManager.instance.playTimerSFX((int)SoundManager.ListaSFX.sonoroTimer);
            aviso2 = true;
        }
        else if (formattedTime == "09:57" && !aviso3)
        {
            SoundManager.instance.playTimerSFX((int)SoundManager.ListaSFX.sonoroTimer);
            aviso3 = true;
        }
        else if (formattedTime == "01:00" && !aviso4)
        {
            SoundManager.instance.playTimerSFX((int)SoundManager.ListaSFX.sonoroTimer);
            aviso4 = true;
        }
        else if (formattedTime == "00:59" && !aviso5)
        {
            SoundManager.instance.playTimerSFX((int)SoundManager.ListaSFX.sonoroTimer);
            aviso5 = true;
        }
        else if (formattedTime == "00:58" && !aviso6)
        {
            SoundManager.instance.playTimerSFX((int)SoundManager.ListaSFX.sonoroTimer);
            aviso6 = true;
        }


    }
}
