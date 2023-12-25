using UnityEngine;
using System.Collections.Generic;
using UnityEngine.UI;

public class Monster1 : MonoBehaviour
{
    public float delay = 2f;

    public UnityEngine.Rendering.Universal.Light2D light2D;
    public Transform pivotPlayerObject;
    public Transform[] targetObject;
    public float moveSpeedNormal = 2f;
    public float moveSpeedLight = 5f;
    public GameObject player;
    public int monsterRoomIndex;
    
    [Tooltip("The time limit the player can be hidden with the torchlight on")]
    public float expositionTimeLimit;

    private float lightExpositionTime;
    private float stoppingDistance = 1f;
    private bool shouldMove = false;
    private Collider2D thisCollider;
    private bool isNearPlayer = false;
    private int index = 0;

    //�udio:
    private AudioSource audioSource;

    //Lista de SFX:
    [SerializeField] private AudioClip sfxVoice1;
    [SerializeField] private AudioClip sfxVoice2;
    [SerializeField] private AudioClip sfxVoice3;

    //Vari�veis �udio:
    [SerializeField] private float limitVoice = 8f;
    private float timerVoice = 0f;
    private int typeVoice = 1;
    private bool huntVoice = false;
    private bool inDialogue = false;

    Animation fadeImage = null;

    void Start()
    {
        Invoke("StartMoving", delay);
        thisCollider = this.GetComponent<Collider2D>();
        audioSource = GetComponent<AudioSource>();

        fadeImage = FindFadeImageByTag("fadePanel", true);
        fadeImage.gameObject.SetActive(true);
    }


    void Update()
    {
        if(!inDialogue){
            if (!light2D.gameObject.activeSelf) {
                if (fadeImage.IsPlaying("fadePanelIn")) {
                    fadeImage.CrossFade("fadePanelOut", 0.1f);

                }
            }

            List<Collider2D> colliders = new ();
            ContactFilter2D contactFilter = new ContactFilter2D();
            contactFilter.NoFilter();
            
            thisCollider.OverlapCollider(contactFilter, colliders);

            bool sameRoom = (monsterRoomIndex == player.GetComponent<PlayerController>().GetRoomIndex());

            if (Vector3.Distance(this.transform.position, player.transform.position) < 8) 
            {
                isNearPlayer = true;
            }
            else
            {
                isNearPlayer = false;
            }

            if (light2D.gameObject.activeSelf && isNearPlayer && sameRoom)
            {
                Vector3 direction = pivotPlayerObject.position - transform.position;
                direction.Normalize();
                transform.Translate(direction * moveSpeedLight * Time.deltaTime, Space.World);

                if (direction.x < 0)
                {
                    // Moving left, flip the object
                    transform.localScale = new Vector3(-Mathf.Abs(transform.localScale.x), transform.localScale.y, transform.localScale.z);
                }
                else if (direction.x > 0)
                {
                    // Moving right, unflip the object
                    transform.localScale = new Vector3(Mathf.Abs(transform.localScale.x), transform.localScale.y, transform.localScale.z);
                }

                //Audio Persegui��o Normal:
                if (!huntVoice)
                {
                    SoundManager.instance.playDinamicBGM(2, 3, 1);
                    SoundManager.instance.stopBGM(2);
                    audioSource.PlayOneShot(sfxVoice3);
                    huntVoice = true;
                }

                if (Mathf.Abs(pivotPlayerObject.position.x - transform.position.x) > stoppingDistance) {

                    if (!light2D.gameObject.activeSelf)
                    {
                    SoundManager.instance.stopDinamicBGM();
                    
                    }

                    lightExpositionTime = 0;

                }
                else
                {
                    //print($"PlayerObject position: {pivotPlayerObject.position}\nMonster Position: {transform.position}\n" +
                    //    $"Distance: {Mathf.Abs(pivotPlayerObject.position.x - transform.position.x)} mg ={direction.magnitude} & sqrMg {direction.sqrMagnitude}\nExposition Time: {lightExpositionTime}");

                    if (light2D.gameObject.activeSelf)
                    {
                        lightExpositionTime += Time.deltaTime;

                        if(!fadeImage.IsPlaying("fadePanelIn"))
                            fadeImage.Play("fadePanelIn");

                    }

                    if (lightExpositionTime > 5) {

                        SoundManager.instance.stopDinamicBGM();
                        GameManagement.Instance.SetPlayerPosition();
                        lightExpositionTime = 0;
                        if (fadeImage.IsPlaying("fadePanelIn")) 
                            fadeImage.CrossFade("fadePanelOut", 0.01f);


                    }

                }

            }
            else if (shouldMove)
            {

                Vector3 direction = targetObject[index].position - transform.position;
                
                if (direction.x < 0)
                {
                    // Moving left, flip the object
                    transform.localScale = new Vector3(-Mathf.Abs(transform.localScale.x), transform.localScale.y, transform.localScale.z);
                }
                else if (direction.x > 0)
                {
                    // Moving right, unflip the object
                    transform.localScale = new Vector3(Mathf.Abs(transform.localScale.x), transform.localScale.y, transform.localScale.z);
                }


                //SFX Persegui��o:
                if (huntVoice)
                {
                    huntVoice = false;
                    SoundManager.instance.stopDinamicBGM();
                }

                if (direction.magnitude > stoppingDistance)
                {
                    direction.Normalize();
                    transform.Translate(direction * moveSpeedNormal * Time.deltaTime, Space.World);

                }
                else
                {
                    shouldMove = false;

                    lightExpositionTime = 0;

                    Invoke("StartMoving", delay);

                    if (index == targetObject.Length - 1)
                    {
                        index = 0;
                    }
                    else
                    {
                        index++;
                    }
                }
            }

            //SFX Grunindos:
            timerVoice = timerVoice + Time.deltaTime;
            if (timerVoice > limitVoice && !light2D.gameObject.activeSelf && shouldMove)
            {
                switch (typeVoice)
                {
                    case 1:
                        audioSource.PlayOneShot(sfxVoice1);
                        typeVoice = 2;
                        timerVoice = 0f;

                        break;

                    case 2:
                        audioSource.PlayOneShot(sfxVoice2);
                        typeVoice = 1;
                        timerVoice = 0f;
                        break;
                }
            }

        }

       

    }

    public void StartMoving()
    {        
        shouldMove = true;
    }

    public void StartDialogue()
    {        
        inDialogue = true;
    }

    public void StopDialogue()
    {        
        inDialogue = false;
    }

    public bool IsNearPlayer()
    {
        return isNearPlayer;
    }



    Animation FindFadeImageByTag(string tag, bool includeInactive) {

        Animation img = null;
        Animation[] fadeImg = null;

        if (includeInactive) {
            fadeImg = Resources.FindObjectsOfTypeAll<Animation>();
            foreach (Animation i in fadeImg) {
                if (i.CompareTag(tag)) {
                    img = i;
                    break;
                }
            }
        } else {

            GameObject.FindGameObjectWithTag(tag).TryGetComponent<Animation>(out img);    
        }

        
        return img;

    }
}