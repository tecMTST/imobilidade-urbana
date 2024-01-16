using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class TimerController : MonoBehaviour
{
    
    public static TimerController Instance;
    public Animator timerTextAnimator;
    
    public float initialTime;
    public float penalty;

    [HideInInspector]
    public bool isPaused = true;

    private float currentTime;

    
    private string gameOverScene = "GameOverScene"; 
    
    void Start()
    {
        Instance = this;

        //DontDestroyOnLoad(gameObject);
        currentTime = initialTime;
    }

    void Update()
    {
        if (!isPaused && currentTime > 1)
        {
            currentTime -= Time.deltaTime;
            if (currentTime < 180)
            {
                timerTextAnimator.enabled = true;
            }
        }
        else if (!isPaused)
        {
            SceneManager.LoadScene(gameOverScene);
        }
    }

    public void Captured()
    {
        currentTime -= penalty;
    }

    public float GetCurrentTime()
    {
        return currentTime;
    }

    public void PauseTimer()
    {
        isPaused = true;
    }

    public void ResumeTimer()
    {
        isPaused = false;
    }

    public bool GetIsPaused()
    {
        return isPaused;
    }
}
