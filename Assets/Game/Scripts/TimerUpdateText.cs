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
    }
}
